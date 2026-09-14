import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { CartContext } from "@contexts/CartContext";
import { AuthContext } from "@contexts/AuthContext";
import Card from "@components/common/Card";
import styles from "./Checkout.module.css";
import { api } from "@lib/api";

// PayPal client ID - replace with your own in production
const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb"; // Use "sb" for sandbox testing

const Checkout = () => {
  const { cartItems, getTotal, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("paypal");

  const total = getTotal();

  const saveOrder = async (paymentDetails) => {
    try {
      await api.orders.create({
        buyer_id: user?.id || null,
        buyer_name: user?.name || "Guest",
        buyer_email: user?.email || "guest@email.com",
        seller_name: cartItems[0]?.seller?.name || null,
        items: cartItems,
        total: total,
        status: "completed",
        payment_method: paymentDetails?.paymentMethod || "PayPal",
        transaction_id: paymentDetails?.transactionId || `PAYPAL-${Date.now()}`,
      });
    } catch (err) {
      console.error("Failed to save order:", err.message);
      alert("Order could not be saved. Please contact support.");
      return;
    }

    clearCart();
    setOrderComplete(true);

    setTimeout(() => {
      navigate("/orders");
    }, 3000);
  };

  const handlePlaceOrder = () => {
    if (paymentMethod === "paypal") return;

    setProcessing(true);
    setTimeout(async () => {
      await saveOrder({
        paymentMethod: "Test Payment",
        transactionId: `TEST-${Date.now()}`,
      });
      setProcessing(false);
    }, 1500);
  };

  if (cartItems.length === 0 && !orderComplete) {
    return (
      <div className={styles.checkoutPage}>
        <Card title="Checkout">
          <p>Your cart is empty</p>
          <button onClick={() => navigate("/marketplace")} className={styles.shopBtn}>
            Continue Shopping
          </button>
        </Card>
      </div>
    );
  }

  if (orderComplete) {
    return (
      <div className={styles.checkoutPage}>
        <Card title="Order Complete! 🎉">
          <div className={styles.successMessage}>
            <p>Your order has been placed successfully!</p>
            <p className={styles.orderId}>Thank you for your purchase!</p>
            <button onClick={() => navigate("/orders")} className={styles.shopBtn}>
              View My Orders
            </button>
          </div>
        </Card>
      </div>
    );
  }

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          description: "TrustHive Purchase",
          amount: {
            currency_code: "ZAR",
            value: total.toFixed(2),
          },
          items: cartItems.map((item) => ({
            name: item.title,
            quantity: item.quantity,
            unit_amount: {
              currency_code: "ZAR",
              value: item.price.toFixed(2),
            },
          })),
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(async (details) => {
      await saveOrder({
        paymentMethod: "PayPal",
        transactionId: details.id,
        orderId: details.id,
        payerEmail: details.payer.email_address,
      });
    });
  };

  const onError = (err) => {
    console.error("PayPal Error:", err);
    alert("There was an error processing your payment. Please try again.");
  };

  return (
    <div className={styles.checkoutPage}>
      <div className={styles.checkoutLayout}>
        <div className={styles.orderSummary}>
          <Card title="Order Summary">
            {cartItems.map((item) => (
              <div key={item.id} className={styles.orderItem}>
                <span className={styles.itemName}>{item.title}</span>
                <span className={styles.itemQty}>×{item.quantity}</span>
                <span className={styles.itemPrice}>R{item.price * item.quantity}</span>
              </div>
            ))}
            <div className={styles.totalSection}>
              <span>Subtotal</span>
              <span>R{total.toFixed(2)}</span>
            </div>
            <div className={styles.totalSection}>
              <span>Delivery</span>
              <span>R0.00</span>
            </div>
            <div className={`${styles.totalSection} ${styles.grandTotal}`}>
              <span>
                <strong>Total</strong>
              </span>
              <span>
                <strong>R{total.toFixed(2)}</strong>
              </span>
            </div>
          </Card>
        </div>

        <div className={styles.paymentSection}>
          <Card title="Payment">
            <div className={styles.paymentInfo}>
              <div className={styles.formGroup}>
                <label>Payment Method</label>
                <select
                  value={paymentMethod}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                  className={styles.paymentSelect}
                >
                  <option value="paypal">PayPal</option>
                  <option value="test">Test Payment (No real charge)</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Email</label>
                <input type="email" value={user?.email || ""} readOnly />
              </div>

              {paymentMethod === "paypal" ? (
                <div className={styles.paypalContainer}>
                  <PayPalScriptProvider
                    options={{
                      clientId: PAYPAL_CLIENT_ID,
                      currency: "ZAR",
                      intent: "capture",
                    }}
                  >
                    <PayPalButtons
                      createOrder={createOrder}
                      onApprove={onApprove}
                      onError={onError}
                      style={{
                        layout: "vertical",
                        color: "blue",
                        shape: "rect",
                        label: "paypal",
                      }}
                    />
                  </PayPalScriptProvider>
                  <p className={styles.paypalNote}>🔒 Secure payment processed by PayPal</p>
                </div>
              ) : (
                <button onClick={handlePlaceOrder} disabled={processing} className={styles.placeOrderBtn}>
                  {processing ? "Processing..." : `Place Test Order (R${total.toFixed(2)})`}
                </button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
