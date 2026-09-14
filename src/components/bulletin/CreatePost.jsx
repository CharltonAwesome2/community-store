import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./CreatePost.module.css";
import { api } from "@lib/api";

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcements",
  });

  const handleSubmit = async (e) => {
    try {
      await api.bulletin.create({
        title: formData.title,
        content: formData.content,
        category: formData.category,
        author_id: user.id,
        author_name: user.name,
        author_role: user.role,
        likes: 0,
        comments: 0,
      });
      alert("Post created successfully!");
      navigate("/bulletin");
    } catch (err) {
      alert(`Failed to create post: ${err.message}`);
    }
  };

  return (
    <div className={styles.createPost}>
      <h1>Create Bulletin Post</h1>
      <Card>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label>Title *</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Post title..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <option value="announcements">Announcements</option>
              <option value="events">Events</option>
              <option value="services">Services</option>
              <option value="promotions">Promotions</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label>Content *</label>
            <textarea
              required
              rows="6"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              placeholder="Write your post content..."
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Create Post
          </button>
        </form>
      </Card>
    </div>
  );
};

export default CreatePost;
