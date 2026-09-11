import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import { mockBulletinPosts } from "@data/mockData";
import styles from "./BulletinBoard.module.css";

const BulletinBoard = () => {
  const { user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const stored = localStorage.getItem("bulletinPosts");
    if (stored) {
      setPosts(JSON.parse(stored));
    } else {
      setPosts(mockBulletinPosts);
      localStorage.setItem("bulletinPosts", JSON.stringify(mockBulletinPosts));
    }
  }, []);

  const filteredPosts = filter === "all" ? posts : posts.filter((p) => p.category === filter);

  const categories = ["all", "events", "services", "announcements", "promotions", "other"];

  return (
    <div className={styles.bulletinBoard}>
      <div className={styles.header}>
        <h1>Community Bulletin Board</h1>
        {user && (
          <Link to="/bulletin/create" className={styles.createBtn}>
            + Create Post
          </Link>
        )}
      </div>

      <div className={styles.filterBar}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.filterBtn} ${filter === cat ? styles.active : ""}`}
            onClick={() => setFilter(cat)}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </button>
        ))}
      </div>

      <div className={styles.postsGrid}>
        {filteredPosts.length === 0 ? (
          <p className={styles.noPosts}>No posts found</p>
        ) : (
          filteredPosts.map((post) => (
            <Card key={post.id} className={styles.postCard}>
              <div className={styles.postHeader}>
                <div className={styles.postMeta}>
                  <span className={styles.categoryBadge}>{post.category}</span>
                  <span className={styles.postDate}>{post.createdAt}</span>
                </div>
                <div className={styles.authorInfo}>
                  <span className={styles.authorName}>{post.author}</span>
                  <span className={styles.authorRole}>{post.authorRole}</span>
                </div>
              </div>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postContent}>{post.content}</p>
              <div className={styles.postFooter}>
                <button className={styles.likeBtn}>❤️ {post.likes}</button>
                <span className={styles.comments}>💬 {post.comments}</span>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default BulletinBoard;
