import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "@components/common/Card";
import { categories } from "@data/categories";
import { mockProducts } from "@data/mockData";
import styles from "./ProductList.module.css";

const ProductList = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    // Load products from localStorage or use mock
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(mockProducts);
      localStorage.setItem("products", JSON.stringify(mockProducts));
    }
  }, []);

  useEffect(() => {
    // Apply filters
    let filtered = [...products];

    // Category filter
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
      filtered = filtered.filter(p => p.category === categoryParam);
    }

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filter (if not from URL)
    if (selectedCategory !== "all" && !searchParams.get("category")) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }

    // Price range filter
    if (priceRange.min) {
      filtered = filtered.filter(p => p.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter(p => p.price <= parseInt(priceRange.max));
    }

    // Sort
    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        filtered.sort((a, b) => b.seller.rating - a.seller.rating);
        break;
      default:
        break;
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory, priceRange, sortBy, searchParams]);

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
  };

  return (
    <div className={styles.productListPage}>
      <h1>Marketplace</h1>

      <div className={styles.filtersSection}>
        <Card title="Filters">
          <div className={styles.filtersGrid}>
            <div className={styles.filterGroup}>
              <label>Search</label>
              <input
                type="text"
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={styles.searchInput}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={styles.selectInput}
              >
                <option value="all">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.icon} {cat.name}</option>
                ))}
              </select>
            </div>

            <div className={styles.filterGroup}>
              <label>Price Range</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                />
              </div>
            </div>

            <div className={styles.filterGroup}>
              <label>Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className={styles.selectInput}
              >
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>

          <button onClick={clearFilters} className={styles.clearBtn}>
            Clear All Filters
          </button>
        </Card>
      </div>

      <div className={styles.resultsHeader}>
        <span className={styles.resultCount}>{filteredProducts.length} items found</span>
        <Link to="/create-listing" className={styles.createBtn}>
          + Create Listing
        </Link>
      </div>

      <div className={styles.productsGrid}>
        {filteredProducts.length === 0 ? (
          <div className={styles.noResults}>
            <p>No products found. Try adjusting your filters.</p>
          </div>
        ) : (
          filteredProducts.map(product => (
            <Card key={product.id} variant="product">
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img src={`/images/${product.images[0]}`} alt={product.title} />
                  <span className={styles.productPrice}>R{product.price}</span>
                  {product.seller.verified && (
                    <span className={styles.verifiedBadge}>✓ Verified</span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>
                  <p className={styles.productCategory}>{product.category}</p>
                  <div className={styles.productMeta}>
                    <span className={styles.sellerName}>By {product.seller.name}</span>
                    <span className={styles.productRating}>⭐ {product.seller.rating}</span>
                  </div>
                  <Link to={`/product/${product.id}`} className={styles.viewDetailsBtn}>
                    View Details
                  </Link>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default ProductList;