import React from "react";
import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import Card from "@components/common/Card";
import { categories } from "@data/categories";
import { mockProducts } from "@data/mockData";
import { imagePath } from "@utils/helpers";
import styles from "./Home.module.css";

const Home = () => {
  const featuredProducts = mockProducts.slice(0, 4);

  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1>Welcome to Community Store</h1>
          <p>Buy, sell, and trade within your campus community</p>
          <Link to="/marketplace" className={styles.heroBtn}>
            Start Shopping
          </Link>
        </div>
      </section>

      <section className={styles.categories}>
        <h2>Browse Categories</h2>
        <div className={styles.categoryGrid}>
          {categories.map(({ id, name, Icon }) => (
            <Link
              key={id}
              to={`/marketplace?category=${id}`}
              className={styles.categoryCard}
            >
              <div className={styles.categoryIcon}>
                <Icon size={32} />
              </div>
              <span>{name}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className={styles.featured}>
        <h2>Featured Items</h2>
        <div className={styles.productGrid}>
          {featuredProducts.map((product) => (
            <Card key={product.id} variant="product">
              <div className={styles.productImage}>
                <img
                  src={imagePath(product.images[0])}
                  alt={product.title}
                />
                <span className={styles.productPrice}>R{product.price}</span>
              </div>
              <div className={styles.productInfo}>
                <h3>{product.title}</h3>
                <p className={styles.productSeller}>
                  By {product.seller.name}
                </p>
                <div className={styles.productRating}>
                  <FaStar color="#f5b301" /> {product.seller.rating} (
                  {product.seller.totalReviews} reviews)
                </div>
                <Link to={`/product/${product.id}`} className={styles.viewBtn}>
                  View Details
                </Link>
              </div>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;