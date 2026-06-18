import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./CreatePost.module.css";

const CreatePost = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "announcements",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!user) {
      navigate("/login");
      return;
    }

    const posts = JSON.parse(localStorage.getItem("bulletinPosts") || "[]");
    const newPost = {
      id: Date.now(),
      ...formData,
      author: user.name,
      authorRole: user.role,
      createdAt: new Date().toISOString().split("T")[0],
      comments: 0,
      likes: 0,
    };

    posts.unshift(newPost);
    localStorage.setItem("bulletinPosts", JSON.stringify(posts));
    
    alert("Post created successfully!");
    navigate("/bulletin");
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
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="Post title..."
            />
          </div>

          <div className={styles.formGroup}>
            <label>Category *</label>
            <select
              required
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
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
              onChange={(e) => setFormData({...formData, content: e.target.value})}
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