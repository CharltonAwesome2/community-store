import React, { createContext, useState, useEffect } from "react";
import { useLocalStorage } from "@hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);

  const login = async (email, password) => {
    setLoading(true);
    try {
      // Mock login - In production, call API
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const foundUser = users.find(u => u.email === email);
      
      if (foundUser) {
        setUser(foundUser);
        return { success: true };
      }
      return { success: false, error: "Invalid credentials" };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      // Check if user exists
      if (users.find(u => u.email === userData.email)) {
        return { success: false, error: "User already exists" };
      }

      const newUser = {
        id: Date.now(),
        ...userData,
        verified: userData.role === "student" ? false : true,
        joinDate: new Date().toISOString().split("T")[0],
        rating: 0,
        totalReviews: 0,
        isActive: true,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));
      setUser(newUser);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};