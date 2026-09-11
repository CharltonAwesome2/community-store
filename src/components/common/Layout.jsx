import React, { useContext } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { AuthContext } from "@contexts/AuthContext";
import { CartContext } from "@contexts/CartContext";
import { FaShoppingCart, FaUser, FaSignOutAlt, FaStore } from "react-icons/fa";
import styles from "./Layout.module.css";

const Layout = () => {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <Link to="/" className={styles.logo}>
            <img src={import.meta.env.BASE_URL + "cput-logo.png"} alt="CPUT" className={styles.logoImg} />
            <span className={styles.logoText}>Community Store</span>
          </Link>

          <nav className={styles.nav}>
            <Link to="/" className={styles.navLink}>Home</Link>
            <Link to="/marketplace" className={styles.navLink}>Marketplace</Link>
            <Link to="/bulletin" className={styles.navLink}>Bulletin</Link>
            
            {user ? (
              <>
                {user.role === "vendor" && (
                  <Link to="/vendor/dashboard" className={styles.navLink}>
                    <FaStore /> Dashboard
                  </Link>
                )}
                {user.role === "admin" && (
                  <Link to="/admin/dashboard" className={styles.navLink}>
                    Admin
                  </Link>
                )}
                <Link to="/cart" className={styles.navLink}>
                  <FaShoppingCart />
                  {cartItems.length > 0 && (
                    <span className={styles.cartBadge}>{cartItems.length}</span>
                  )}
                </Link>
                <div className={styles.userMenu}>
                  <button className={styles.userBtn}>
                    <FaUser /> {user.name}
                  </button>
                  <div className={styles.dropdown}>
                    <Link to="/profile" className={styles.dropdownItem}>Profile</Link>
                    <Link to="/orders" className={styles.dropdownItem}>My Orders</Link>
                    <button onClick={logout} className={styles.dropdownItem}>
                      <FaSignOutAlt /> Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.navLink}>Login</Link>
                <Link to="/register" className={`${styles.navLink} ${styles.registerBtn}`}>
                  Register
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>

      <main className={styles.container}>
        <Outlet />
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <p>© 2026 TrustHive - CPUT Project Management 3</p>
          <div className={styles.footerLinks}>
            <Link to="/about">About</Link>
            <Link to="/terms">Terms</Link>
            <Link to="/privacy">Privacy</Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;