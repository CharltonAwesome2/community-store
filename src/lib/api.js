// src/lib/api.js
import { supabase } from "@lib/supabase";
import { mapUser, mapProduct, mapPost, mapOrder, mapNotification } from "@utils/mappers";

/**
 * Central API layer. Every component should call these functions
 * instead of touching `supabase.from(...)` directly.
 *
 * All methods throw on error (via `if (error) throw error`), so callers
 * can use try/catch or .catch() uniformly.
 */

const throwIfError = (error, context) => {
  if (error) {
    console.error(`[api] ${context}:`, error.message);
    throw error;
  }
};

export const api = {
  // ── USERS ─────────────────────────────────────────────
  users: {
    getByEmail: async (email) => {
      const { data, error } = await supabase.from("users").select().eq("email", email).maybeSingle();
      throwIfError(error, "users.getByEmail");
      return data ? mapUser(data) : null;
    },

    getById: async (id) => {
      const { data, error } = await supabase.from("users").select().eq("id", id).maybeSingle();
      throwIfError(error, "users.getById");
      return data ? mapUser(data) : null;
    },

    count: async () => {
      const { count, error } = await supabase.from("users").select("*", { count: "exact", head: true });
      throwIfError(error, "users.count");
      return count ?? 0;
    },

    countUnverified: async () => {
      const { count, error } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("verified", false);
      throwIfError(error, "users.countUnverified");
      return count ?? 0;
    },

    createProfile: async (row) => {
      const { data, error } = await supabase.from("users").insert(row).select().single();
      throwIfError(error, "users.createProfile");
      return mapUser(data);
    },
  },

  // ── PRODUCTS ──────────────────────────────────────────
  products: {
    list: async () => {
      const { data, error } = await supabase.from("products").select().order("created_at", { ascending: false });
      throwIfError(error, "products.list");
      return (data || []).map(mapProduct);
    },

    getById: async (id) => {
      const { data, error } = await supabase.from("products").select().eq("id", id).maybeSingle();
      throwIfError(error, "products.getById");
      return data ? mapProduct(data) : null;
    },

    listBySeller: async (sellerId) => {
      const { data, error } = await supabase.from("products").select().eq("seller_id", sellerId);
      throwIfError(error, "products.listBySeller");
      return (data || []).map(mapProduct);
    },

    count: async () => {
      const { count, error } = await supabase.from("products").select("*", { count: "exact", head: true });
      throwIfError(error, "products.count");
      return count ?? 0;
    },

    create: async (row) => {
      const { data, error } = await supabase.from("products").insert(row).select().single();
      throwIfError(error, "products.create");
      return mapProduct(data);
    },
  },

  // ── BULLETIN POSTS ────────────────────────────────────
  bulletin: {
    list: async () => {
      const { data, error } = await supabase.from("bulletin_posts").select().order("created_at", { ascending: false });
      throwIfError(error, "bulletin.list");
      return (data || []).map(mapPost);
    },

    create: async (row) => {
      const { data, error } = await supabase.from("bulletin_posts").insert(row).select().single();
      throwIfError(error, "bulletin.create");
      return mapPost(data);
    },
  },

  // ── ORDERS ────────────────────────────────────────────
  orders: {
    list: async () => {
      const { data, error } = await supabase.from("orders").select().order("created_at", { ascending: false });
      throwIfError(error, "orders.list");
      return (data || []).map(mapOrder);
    },

    listBySeller: async (sellerName) => {
      const { data, error } = await supabase.from("orders").select().eq("seller_name", sellerName);
      throwIfError(error, "orders.listBySeller");
      return (data || []).map(mapOrder);
    },

    count: async () => {
      const { count, error } = await supabase.from("orders").select("*", { count: "exact", head: true });
      throwIfError(error, "orders.count");
      return count ?? 0;
    },

    create: async (row) => {
      const { data, error } = await supabase.from("orders").insert(row).select().single();
      throwIfError(error, "orders.create");
      return mapOrder(data);
    },
  },

  // ── NOTIFICATIONS ─────────────────────────────────────
  notifications: {
    listByUser: async (userId) => {
      const { data, error } = await supabase
        .from("notifications")
        .select()
        .eq("user_id", userId)
        .order("created_at", { ascending: false });
      throwIfError(error, "notifications.listByUser");
      return (data || []).map(mapNotification);
    },

    create: async (row) => {
      const { data, error } = await supabase.from("notifications").insert(row).select().single();
      throwIfError(error, "notifications.create");
      return mapNotification(data);
    },

    markAsRead: async (id) => {
      const { error } = await supabase.from("notifications").update({ read: true }).eq("id", id);
      throwIfError(error, "notifications.markAsRead");
    },

    markAllAsRead: async (userId) => {
      const { error } = await supabase
        .from("notifications")
        .update({ read: true })
        .eq("user_id", userId)
        .eq("read", false);
      throwIfError(error, "notifications.markAllAsRead");
    },

    delete: async (id) => {
      const { error } = await supabase.from("notifications").delete().eq("id", id);
      throwIfError(error, "notifications.delete");
    },

    clearAll: async (userId) => {
      const { error } = await supabase.from("notifications").delete().eq("user_id", userId);
      throwIfError(error, "notifications.clearAll");
    },

    getPreferences: async (userId) => {
      const { data, error } = await supabase
        .from("notification_preferences")
        .select()
        .eq("user_id", userId)
        .maybeSingle();
      throwIfError(error, "notifications.getPreferences");
      return data;
    },

    savePreferences: async (row) => {
      const { error } = await supabase.from("notification_preferences").upsert(row, { onConflict: "user_id" });
      throwIfError(error, "notifications.savePreferences");
    },
  },
};
