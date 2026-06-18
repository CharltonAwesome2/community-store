import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PayPalScriptProvider } from "@paypal/react-paypal-js";
import { AuthProvider } from "@contexts/AuthContext";
import { CartProvider } from "@contexts/CartContext";
import Layout from "@components/common/Layout";
import Home from "@pages/Home";
import About from "@pages/About";
import Login from "@components/auth/Login";
import Register from "@components/auth/Register";
import ProductList from "@components/marketplace/ProductList";
import ProductDetail from "@components/marketplace/ProductDetail";
import CreateListing from "@components/marketplace/CreateListing";
import Cart from "@components/cart/Cart";
import Checkout from "@components/checkout/Checkout";
import BulletinBoard from "@components/bulletin/BulletinBoard";
import CreatePost from "@components/bulletin/CreatePost";
import AdminDashboard from "@components/dashboard/AdminDashboard";
import VendorDashboard from "@components/dashboard/VendorDashboard";
import "@styles/global.css";

const PAYPAL_CLIENT_ID = import.meta.env.VITE_PAYPAL_CLIENT_ID || "sb"; // Use "sb" for sandbox testing

function App() {
  return (
    <PayPalScriptProvider options={{ 
      clientId: PAYPAL_CLIENT_ID,
      currency: "ZAR",
      intent: "capture",
    }}>
      <BrowserRouter>
        <AuthProvider>
          <CartProvider>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="about" element={<About />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="marketplace" element={<ProductList />} />
                <Route path="product/:id" element={<ProductDetail />} />
                <Route path="create-listing" element={<CreateListing />} />
                <Route path="cart" element={<Cart />} />
                <Route path="checkout" element={<Checkout />} />
                <Route path="bulletin" element={<BulletinBoard />} />
                <Route path="bulletin/create" element={<CreatePost />} />
                <Route path="admin/dashboard" element={<AdminDashboard />} />
                <Route path="vendor/dashboard" element={<VendorDashboard />} />
              </Route>
            </Routes>
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </PayPalScriptProvider>
  );
}

export default App;