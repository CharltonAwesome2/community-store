import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "@contexts/CartContext";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./Cart.module.css";

const Cart = () => {
  const { 
    cartItems, 
    removeFromCart, 
    updateQuantity, 
    getTotal,
    getItemCount,
    clearCart 
  } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate("/login");
      return;
    }
    navigate("/checkout");
  };

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.emptyIcon}>🛒</div>
        <h2>Your cart is empty</h2>
        <p>Looks like you haven't added any items yet.</p>
        <Link to="/marketplace" className={styles.shopBtn}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.cartPage}>
      <h1>Shopping Cart</h1>
      <div className={styles.cartLayout}>
        <div className={styles.itemsSection}>
          <Card>
            <div className={styles.cartHeader}>
              <span>{getItemCount()} items in your cart</span>
              <button onClick={clearCart} className={styles.clearBtn}>
                Clear Cart
              </button>
            </div>

            {cartItems.map(item => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemImage}>
                  <img src={`/images/${item.images[0]}`} alt={item.title} />
                </div>
                <div className={styles.itemDetails}>
                  <h3 className={styles.itemTitle}>{item.title}</h3>
                  <p className={styles.itemPrice}>R{item.price}</p>
                  <div className={styles.itemActions}>
                    <div className={styles.quantityControl}>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className={styles.qtyBtn}
                      >
                        -
                      </button>
                      <span className={styles.qtyDisplay}>{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className={styles.qtyBtn}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className={styles.removeBtn}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  R{item.price * item.quantity}
                </div>
              </div>
            ))}
          </Card>
        </div>

        <div className={styles.summarySection}>
          <Card title="Order Summary">
            <div className={styles.summaryRow}>
              <span>Subtotal ({getItemCount()} items)</span>
              <span>R{getTotal()}</span>
            </div>
            <div className={styles.summaryRow}>
              <span>Delivery</span>
              <span>Free</span>
            </div>
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span><strong>Total</strong></span>
              <span><strong>R{getTotal()}</strong></span>
            </div>
            <button
              onClick={handleCheckout}
              className={styles.checkoutBtn}
            >
              Proceed to Checkout
            </button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Cart;