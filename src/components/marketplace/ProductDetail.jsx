import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { CartContext } from "@contexts/CartContext";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./ProductDetail.module.css";
import { FaCheckCircle } from "react-icons/fa";
import { imagePath } from "@utils/helpers";
import { api } from "@lib/api";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    api.products
      .getById(id)
      .then((p) => setProduct(p))
      .catch((err) => console.error("Failed to load product:", err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    addToCart(product, quantity);
  };

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (!product) {
    return (
      <div className={styles.notFound}>
        <h2>Product not found</h2>
        <Link to="/marketplace" className={styles.backBtn}>
          Back to Marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.productDetail}>
      <div className={styles.backLink}>
        <Link to="/marketplace">← Back to Marketplace</Link>
      </div>

      <div className={styles.detailLayout}>
        <div className={styles.imageSection}>
          <div className={styles.mainImage}>
            <img src={imagePath(product.images[0])} alt={product.title} />
          </div>
          {product.images.length > 1 && (
            <div className={styles.thumbnailGrid}>
              {product.images.map((img, index) => (
                <div key={index} className={styles.thumbnail}>
                  <img src={`/images/${img}`} alt={`${product.title} ${index + 1}`} />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className={styles.infoSection}>
          <Card>
            <div className={styles.productInfo}>
              <h1 className={styles.productTitle}>{product.title}</h1>
              <div className={styles.metaRow}>
                <span className={styles.category}>{product.category}</span>
                <span className={styles.condition}>Condition: {product.condition}</span>
              </div>

              <div className={styles.priceSection}>
                <span className={styles.price}>R{product.price}</span>
                <span className={styles.stockStatus}>In Stock</span>
              </div>

              <div className={styles.sellerInfo}>
                <div className={styles.sellerHeader}>
                  <span className={styles.sellerName}>Seller: {product.seller.name}</span>
                  {product.seller.verified && <span className={styles.verifiedBadge}>✓ Verified</span>}
                </div>
                <div className={styles.sellerRating}>
                  <FaCheckCircle /> {product.seller.rating} ({product.seller.totalReviews} reviews)
                </div>
                <span className={styles.location}>📍 {product.location}</span>
              </div>

              <div className={styles.description}>
                <h3>Description</h3>
                <p>{product.description}</p>
              </div>

              <div className={styles.quantitySection}>
                <label>Quantity</label>
                <div className={styles.quantityControl}>
                  <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className={styles.qtyBtn}>
                    -
                  </button>
                  <span className={styles.qtyDisplay}>{quantity}</span>
                  <button onClick={() => setQuantity(quantity + 1)} className={styles.qtyBtn}>
                    +
                  </button>
                </div>
              </div>

              <div className={styles.actionButtons}>
                <button onClick={handleAddToCart} className={styles.addToCartBtn}>
                  Add to Cart
                </button>
                <button className={styles.wishlistBtn}>♥ Wishlist</button>
              </div>

              {product.seller.id === user?.id && (
                <div className={styles.sellerActions}>
                  <Link to={`/edit-listing/${product.id}`} className={styles.editBtn}>
                    Edit Listing
                  </Link>
                  <button className={styles.deleteBtn}>Delete Listing</button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
