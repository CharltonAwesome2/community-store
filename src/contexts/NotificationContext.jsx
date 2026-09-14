import React, { createContext, useState, useContext, useEffect } from "react";
import { AuthContext } from "./AuthContext";
import { api } from "@lib/api";

export const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useContext(AuthContext);
  const [notifications, setNotifications] = useState([]);
  const [preferences, setPreferences] = useState({
    email: true,
    push: true,
    inApp: true,
    frequency: "immediate",
    types: {
      orders: true,
      messages: true,
      promotions: true,
      updates: true,
    },
  });

  // Load notifications and preferences when the user changes
  useEffect(() => {
    if (!user) {
      setNotifications([]);
      return;
    }

    const load = async () => {
      try {
        const [notifs, prefs] = await Promise.all([
          api.notifications.listByUser(user.id),
          api.notifications.getPreferences(user.id),
        ]);
        setNotifications(notifs);
        if (prefs) {
          setPreferences({
            email: prefs.email,
            push: prefs.push,
            inApp: prefs.in_app,
            frequency: prefs.frequency,
            types: prefs.types,
          });
        }
      } catch (err) {
        console.error("NotificationContext load failed:", err.message);
      }
    };

    load();
  }, [user]);

  const addNotification = async (notification) => {
    if (!user) return null;
    try {
      const mapped = await api.notifications.create({
        user_id: user.id,
        title: notification.title,
        message: notification.message,
        read: false,
      });
      setNotifications((prev) => [mapped, ...prev]);

      if (preferences.push && "Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification(notification.title, {
            body: notification.message,
            icon: "/trusthive-logo.png",
          });
        }
      }
      return mapped;
    } catch (err) {
      console.error("addNotification failed:", err.message);
      return null;
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.notifications.markAsRead(id);
      setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    } catch (err) {
      console.error("markAsRead failed:", err.message);
    }
  };

  const markAllAsRead = async () => {
    if (!user) return;
    try {
      await api.notifications.markAllAsRead(user.id);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    } catch (err) {
      console.error("markAllAsRead failed:", err.message);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await api.notifications.delete(id);
      setNotifications((prev) => prev.filter((n) => n.id !== id));
    } catch (err) {
      console.error("deleteNotification failed:", err.message);
    }
  };

  const clearAllNotifications = async () => {
    if (!user) return;
    try {
      await api.notifications.clearAll(user.id);
      setNotifications([]);
    } catch (err) {
      console.error("clearAllNotifications failed:", err.message);
    }
  };

  const getUnreadCount = () => {
    return notifications.filter((n) => !n.read).length;
  };

  const updatePreferences = async (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);

    if (!user) return;

    const row = {
      user_id: user.id,
      email: updated.email,
      push: updated.push,
      in_app: updated.inApp,
      frequency: updated.frequency,
      types: updated.types,
    };

    const { error } = await supabase.from("notification_preferences").upsert(row, { onConflict: "user_id" });

    if (error) {
      console.error("Failed to save preferences:", error.message);
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      const permission = await Notification.requestPermission();
      return permission === "granted";
    }
    return false;
  };

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        preferences,
        addNotification,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        clearAllNotifications,
        getUnreadCount,
        updatePreferences,
        requestNotificationPermission,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
