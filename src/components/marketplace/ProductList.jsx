import React, { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import Card from "@components/common/Card";
import { categories } from "@data/categories";
import { mockProducts } from "@data/mockData";
import styles from "./ProductList.module.css";
import Select from "react-select";
import { FaStar, FaCheckCircle } from "react-icons/fa";
import { imagePath } from "@utils/helpers";

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [priceRange, setPriceRange] = useState({ min: "", max: "" });
  const [sortBy, setSortBy] = useState("newest");

  const categoryOptions = [
    { value: "all", label: "All Categories", Icon: null },
    ...categories.map(({ id, name, Icon }) => ({
      value: id,
      label: name,
      Icon,
    })),
  ];

  // ── Load products (localStorage or mock) ─────────────────
  useEffect(() => {
    const stored = localStorage.getItem("products");
    if (stored) {
      setProducts(JSON.parse(stored));
    } else {
      setProducts(mockProducts);
      localStorage.setItem("products", JSON.stringify(mockProducts));
    }
  }, []);

  // ── Sync URL category param → local state (one-way) ──────
  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam && categoryParam !== selectedCategory) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Apply filters ────────────────────────────────────────
  useEffect(() => {
    let filtered = [...products];

    // Category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    // Search
    if (searchTerm) {
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.description.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Price range
    if (priceRange.min) {
      filtered = filtered.filter((p) => p.price >= parseInt(priceRange.min));
    }
    if (priceRange.max) {
      filtered = filtered.filter((p) => p.price <= parseInt(priceRange.max));
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
  }, [products, searchTerm, selectedCategory, priceRange, sortBy]);

  // ── Handlers ─────────────────────────────────────────────
  const handleCategoryChange = (opt) => {
    const value = opt?.value ?? "all";
    setSelectedCategory(value);

    if (value === "all") {
      setSearchParams({}, { replace: true });
    } else {
      setSearchParams({ category: value }, { replace: true });
    }
  };

  const clearFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setPriceRange({ min: "", max: "" });
    setSortBy("newest");
    setSearchParams({}, { replace: true });
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
              <Select
                options={categoryOptions}
                value={categoryOptions.find((o) => o.value === selectedCategory)}
                onChange={handleCategoryChange}
                formatOptionLabel={({ label, Icon }) => (
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    {Icon && <Icon size={16} />}
                    <span>{label}</span>
                  </div>
                )}
              />
            </div>

            <div className={styles.filterGroup}>
              <label>Price Range</label>
              <div className={styles.priceInputs}>
                <input
                  type="number"
                  placeholder="Min"
                  value={priceRange.min}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, min: e.target.value })
                  }
                />
                <span>to</span>
                <input
                  type="number"
                  placeholder="Max"
                  value={priceRange.max}
                  onChange={(e) =>
                    setPriceRange({ ...priceRange, max: e.target.value })
                  }
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
        <span className={styles.resultCount}>
          {filteredProducts.length} items found
        </span>
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
          filteredProducts.map((product) => (
            <Card key={product.id} variant="product">
              <div className={styles.productCard}>
                <div className={styles.productImage}>
                  <img
                    src={imagePath(product.images[0])}
                    alt={product.title}
                  />
                  <span className={styles.productPrice}>R{product.price}</span>
                  {product.seller.verified && (
                    <span className={styles.verifiedBadge}>
                      <FaCheckCircle /> Verified
                    </span>
                  )}
                </div>
                <div className={styles.productInfo}>
                  <h3 className={styles.productTitle}>
                    <Link to={`/product/${product.id}`}>{product.title}</Link>
                  </h3>
                  <p className={styles.productCategory}>
                    {categories.find((c) => c.id === product.category)?.name ??
                      product.category}
                  </p>
                  <div className={styles.productMeta}>
                    <span className={styles.sellerName}>
                      By {product.seller.name}
                    </span>
                    <span className={styles.productRating}>
                      <FaStar color="#f5b301" /> {product.seller.rating}
                    </span>
                  </div>
                  <Link
                    to={`/product/${product.id}`}
                    className={styles.viewDetailsBtn}
                  >
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