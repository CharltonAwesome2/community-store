import React, { createContext, useState, useEffect } from "react";
import { supabase } from "@lib/supabase";
import { mapUser } from "@utils/mappers";
import { useLocalStorage } from "@hooks/useLocalStorage";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const [loading, setLoading] = useState(false);

  // On mount: if a saved user exists, trust it. Optionally re-fetch to confirm.
  useEffect(() => {
    // No seeding — data lives in Supabase now.
    // If you want to force a re-fetch of the current user on load, uncomment below.
    // const saved = JSON.parse(localStorage.getItem("user") || "null");
    // if (saved?.email) {
    //   supabase
    //     .from("users")
    //     .select()
    //     .eq("email", saved.email)
    //     .single()
    //     .then(({ data }) => data && setUser(mapUser(data)));
    // }
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("users")
        .select()
        .eq("email", email)
        .single();

      if (error || !data) {
        return { success: false, error: "Invalid credentials" };
      }

      if (data.password !== password) {
        return { success: false, error: "Invalid credentials" };
      }

      const mapped = mapUser(data);
      setUser(mapped);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      // Check if email already exists
      const { data: existing } = await supabase
        .from("users")
        .select("id")
        .eq("email", userData.email)
        .maybeSingle();

      if (existing) {
        return { success: false, error: "User already exists" };
      }

      const row = {
        email: userData.email,
        password: userData.password,
        name: userData.name,
        role: userData.role,
        business_name: userData.businessName || null,
        business_registration: userData.businessRegistration || null,
        verified: userData.role === "student" ? false : true,
        rating: 0,
        total_reviews: 0,
        is_active: true,
      };

      const { data, error } = await supabase
        .from("users")
        .insert(row)
        .select()
        .single();

      if (error) {
        return { success: false, error: error.message };
      }

      const mapped = mapUser(data);
      setUser(mapped);
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
    <AuthContext.Provider
      value={{ user, loading, login, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};