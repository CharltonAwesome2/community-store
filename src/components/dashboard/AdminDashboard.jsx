import React, { useState, useEffect } from "react";
import Card from "@components/common/Card";
import styles from "./AdminDashboard.module.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    pendingVerifications: 0,
  });
  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const users = JSON.parse(localStorage.getItem("users") || "[]");
    const products = JSON.parse(localStorage.getItem("products") || "[]");
    const orders = JSON.parse(localStorage.getItem("orders") || "[]");
    
    setStats({
      totalUsers: users.length,
      totalProducts: products.length,
      totalOrders: orders.length,
      pendingVerifications: users.filter(u => !u.verified).length,
    });

    // Mock recent activity
    setRecentActivity([
      { id: 1, action: "New user registered", user: "John Doe", time: "2 mins ago" },
      { id: 2, action: "Product listed", user: "TechStore", time: "15 mins ago" },
      { id: 3, action: "Order completed", user: "Jane Smith", time: "1 hour ago" },
    ]);
  }, []);

  return (
    <div className={styles.adminDashboard}>
      <h1>Admin Dashboard</h1>
      
      <div className={styles.statsGrid}>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>👥</div>
          <div className={styles.statInfo}>
            <h3>Total Users</h3>
            <p className={styles.statNumber}>{stats.totalUsers}</p>
          </div>
        </Card>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div className={styles.statInfo}>
            <h3>Total Products</h3>
            <p className={styles.statNumber}>{stats.totalProducts}</p>
          </div>
        </Card>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>🛒</div>
          <div className={styles.statInfo}>
            <h3>Total Orders</h3>
            <p className={styles.statNumber}>{stats.totalOrders}</p>
          </div>
        </Card>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statInfo}>
            <h3>Pending Verification</h3>
            <p className={styles.statNumber}>{stats.pendingVerifications}</p>
          </div>
        </Card>
      </div>

      <div className={styles.adminSections}>
        <div className={styles.section}>
          <h2>Recent Activity</h2>
          <Card>
            <ul className={styles.activityList}>
              {recentActivity.map(activity => (
                <li key={activity.id} className={styles.activityItem}>
                  <span className={styles.activityAction}>{activity.action}</span>
                  <span className={styles.activityUser}>by {activity.user}</span>
                  <span className={styles.activityTime}>{activity.time}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>

        <div className={styles.section}>
          <h2>Quick Actions</h2>
          <Card>
            <div className={styles.quickActions}>
              <button className={styles.actionBtn}>Verify Users</button>
              <button className={styles.actionBtn}>Moderate Listings</button>
              <button className={styles.actionBtn}>View Reports</button>
              <button className={styles.actionBtn}>Manage Flags</button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;