import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import { categories, conditions } from "@data/categories";
import styles from "./CreateListing.module.css";
import { api } from "@lib/api";

const CreateListing = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
    images: [],
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await api.products.create({
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        category: formData.category,
        condition: formData.condition,
        location: formData.location,
        images: ["placeholder.jpg"],
        status: "active",
        seller_id: user.id,
        seller_name: user.name,
        seller_rating: user.rating ?? 0,
        seller_verified: user.verified ?? false,
      });
      alert("Listing created successfully!");
      navigate("/marketplace");
    } catch (err) {
      alert(`Failed to create listing: ${err.message}`);
    }
  };

  return (
    <div className={styles.createListing}>
      <h1>Create New Listing</h1>
      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="What are you selling?"
            />
          </div>

          <div className={styles.formGroup}>
            <label>Description *</label>
            <textarea
              required
              rows="4"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your item in detail..."
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Price (R) *</label>
              <input
                type="number"
                required
                min="0"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                placeholder="0.00"
              />
            </div>

            <div className={styles.formGroup}>
              <label>Category *</label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="">Select Category</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label>Condition *</label>
              <select
                required
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
              >
                <option value="">Select Condition</option>
                {conditions.map((cond) => (
                  <option key={cond} value={cond}>
                    {cond}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label>Location *</label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g., Bellville Campus"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label>Images</label>
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => {
                // In a real app, handle file upload
                const files = Array.from(e.target.files);
                setFormData({ ...formData, images: files.map((f) => f.name) });
              }}
            />
            <small className={styles.hint}>Upload up to 5 images</small>
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Listing
          </button>
        </form>
      </Card>
    </div>
  );
};

export default CreateListing;
