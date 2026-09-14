import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./VendorDashboard.module.css";
import { api } from "@lib/api";

const VendorDashboard = () => {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalSales: 0,
    revenue: 0,
  });

  useEffect(() => {
    if (!user) return;

    const load = async () => {
      try {
        const [userProducts, userOrders] = await Promise.all([
          api.products.listBySeller(user.id),
          api.orders.listBySeller(user.name),
        ]);
        setProducts(userProducts);
        setOrders(userOrders);
        setStats({
          totalProducts: userProducts.length,
          totalSales: userOrders.length,
          revenue: userOrders.reduce((sum, o) => sum + o.total, 0),
        });
      } catch (err) {
        console.error("VendorDashboard load failed:", err.message);
      }
    };

    load();
  }, [user]);

  return (
    <div className={styles.vendorDashboard}>
      <h1>Vendor Dashboard</h1>

      <div className={styles.statsGrid}>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>📦</div>
          <div>
            <h4>Listings</h4>
            <p className={styles.statNumber}>{stats.totalProducts}</p>
          </div>
        </Card>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>🛒</div>
          <div>
            <h4>Orders</h4>
            <p className={styles.statNumber}>{stats.totalSales}</p>
          </div>
        </Card>
        <Card variant="stats" className={styles.statCard}>
          <div className={styles.statIcon}>💰</div>
          <div>
            <h4>Revenue</h4>
            <p className={styles.statNumber}>R{stats.revenue}</p>
          </div>
        </Card>
      </div>

      <div className={styles.vendorActions}>
        <Link to="/create-listing" className={styles.actionBtn}>
          + Create New Listing
        </Link>
      </div>

      <div className={styles.sections}>
        <div className={styles.section}>
          <h2>My Listings</h2>
          <Card>
            {products.length === 0 ? (
              <p className={styles.empty}>No listings yet. Create your first listing!</p>
            ) : (
              <div className={styles.productList}>
                {products.map((product) => (
                  <div key={product.id} className={styles.productItem}>
                    <div className={styles.productInfo}>
                      <h4>{product.title}</h4>
                      <span className={styles.productPrice}>R{product.price}</span>
                    </div>
                    <span className={styles.productStatus}>Active</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>

        <div className={styles.section}>
          <h2>Recent Orders</h2>
          <Card>
            {orders.length === 0 ? (
              <p className={styles.empty}>No orders yet.</p>
            ) : (
              <div className={styles.orderList}>
                {orders.slice(0, 5).map((order) => (
                  <div key={order.id} className={styles.orderItem}>
                    <div>
                      <span className={styles.orderBuyer}>{order.buyer}</span>
                      <span className={styles.orderTotal}>R{order.total}</span>
                    </div>
                    <span className={styles.orderStatus}>{order.status}</span>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

export default VendorDashboard;
