import React, { createContext, useState, useEffect } from "react";
import { supabase } from "@lib/supabase";
import { api } from "@lib/api";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On mount, check for an existing session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes (login, logout, token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setUser(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadProfile = async (authId) => {
    try {
      const profile = await api.users.getById(authId);
      setUser(profile);
    } catch (err) {
      console.error("loadProfile failed:", err.message);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };
  const login = async (email, password) => {
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setLoading(false);
      return { success: false, error: error.message };
    }

    // onAuthStateChange will fire and load the profile
    return { success: true };
  };

  const register = async (userData) => {
    // 1. Create the auth user
    setLoading(true);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (authError) {
      setLoading(false);
      return { success: false, error: authError.message };
    }

    if (!authData?.user) {
      setLoading(false);
      return { success: false, error: "Signup failed — no user returned" };
    }

    // 2. Create the profile row using the auth UUID
    // 2. Create the profile row using the auth UUID
    try {
      await api.users.createProfile({
        id: authData.user.id,
        email: userData.email,
        name: userData.name,
        role: userData.role,
        business_name: userData.businessName || null,
        business_registration: userData.businessRegistration || null,
        verified: userData.role === "student" ? false : true,
        rating: 0,
        total_reviews: 0,
        is_active: true,
      });
    } catch (err) {
      setLoading(false);
      return { success: false, error: err.message };
    }

    return { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, register, logout }}>{children}</AuthContext.Provider>;
};
