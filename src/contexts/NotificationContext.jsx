import React, { createContext, useState, useContext } from "react";
import { AuthContext } from "./AuthContext";

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

  // Load notifications from localStorage
  React.useEffect(() => {
    if (user) {
      const stored = localStorage.getItem(`notifications_${user.id}`);
      if (stored) {
        setNotifications(JSON.parse(stored));
      }
      
      const prefs = localStorage.getItem(`notification_prefs_${user.id}`);
      if (prefs) {
        setPreferences(JSON.parse(prefs));
      }
    }
  }, [user]);

  // Save notifications to localStorage
  const saveNotifications = (newNotifications) => {
    if (user) {
      localStorage.setItem(`notifications_${user.id}`, JSON.stringify(newNotifications));
    }
  };

  const addNotification = (notification) => {
    const newNotification = {
      id: Date.now(),
      ...notification,
      read: false,
      createdAt: new Date().toISOString(),
    };
    
    const updated = [newNotification, ...notifications];
    setNotifications(updated);
    saveNotifications(updated);
    
    // Trigger browser notification if enabled
    if (preferences.push && "Notification" in window) {
      if (Notification.permission === "granted") {
        new Notification(notification.title, {
          body: notification.message,
          icon: "/trusthive-logo.png",
        });
      }
    }
    
    return newNotification;
  };

  const markAsRead = (notificationId) => {
    const updated = notifications.map(n =>
      n.id === notificationId ? { ...n, read: true } : n
    );
    setNotifications(updated);
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(n => ({ ...n, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
  };

  const deleteNotification = (notificationId) => {
    const updated = notifications.filter(n => n.id !== notificationId);
    setNotifications(updated);
    saveNotifications(updated);
  };

  const clearAllNotifications = () => {
    setNotifications([]);
    saveNotifications([]);
  };

  const getUnreadCount = () => {
    return notifications.filter(n => !n.read).length;
  };

  const updatePreferences = (newPrefs) => {
    const updated = { ...preferences, ...newPrefs };
    setPreferences(updated);
    if (user) {
      localStorage.setItem(`notification_prefs_${user.id}`, JSON.stringify(updated));
    }
  };

  // Request notification permission
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