// Mock API service - Replace with real API calls when backend is ready
import axios from "axios";

// Create axios instance with base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Mock API functions (uses localStorage for demo)
export const mockApi = {
  // Auth endpoints
  auth: {
    login: async (email, password) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const user = users.find(u => u.email === email);
      
      if (!user) {
        throw new Error("Invalid credentials");
      }
      
      return {
        user,
        token: `mock-token-${Date.now()}`,
      };
    },
    
    register: async (userData) => {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      
      if (users.find(u => u.email === userData.email)) {
        throw new Error("User already exists");
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
      
      return {
        user: newUser,
        token: `mock-token-${Date.now()}`,
      };
    },
    
    logout: async () => {
      localStorage.removeItem("authToken");
      localStorage.removeItem("user");
      return { success: true };
    },
    
    getProfile: async () => {
      const user = JSON.parse(localStorage.getItem("user") || "null");
      if (!user) {
        throw new Error("Not authenticated");
      }
      return user;
    },
  },
  
  // Product endpoints
  products: {
    getAll: async () => {
      return JSON.parse(localStorage.getItem("products") || "[]");
    },
    
    getById: async (id) => {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const product = products.find(p => p.id === parseInt(id));
      if (!product) {
        throw new Error("Product not found");
      }
      return product;
    },
    
    create: async (productData) => {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      
      const newProduct = {
        id: Date.now(),
        ...productData,
        seller: {
          id: user?.id,
          name: user?.name,
          rating: user?.rating || 0,
          verified: user?.verified || false,
        },
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      
      products.push(newProduct);
      localStorage.setItem("products", JSON.stringify(products));
      return newProduct;
    },
    
    update: async (id, productData) => {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const index = products.findIndex(p => p.id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Product not found");
      }
      
      products[index] = { ...products[index], ...productData };
      localStorage.setItem("products", JSON.stringify(products));
      return products[index];
    },
    
    delete: async (id) => {
      const products = JSON.parse(localStorage.getItem("products") || "[]");
      const filtered = products.filter(p => p.id !== parseInt(id));
      localStorage.setItem("products", JSON.stringify(filtered));
      return { success: true };
    },
  },
  
  // Order endpoints
  orders: {
    getAll: async () => {
      return JSON.parse(localStorage.getItem("orders") || "[]");
    },
    
    getByUser: async (userId) => {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      return orders.filter(o => o.buyerId === userId);
    },
    
    create: async (orderData) => {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      
      const newOrder = {
        id: Date.now(),
        ...orderData,
        buyerId: user?.id,
        buyer: user?.name,
        buyerEmail: user?.email,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      
      orders.push(newOrder);
      localStorage.setItem("orders", JSON.stringify(orders));
      return newOrder;
    },
    
    updateStatus: async (id, status) => {
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      const index = orders.findIndex(o => o.id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Order not found");
      }
      
      orders[index].status = status;
      localStorage.setItem("orders", JSON.stringify(orders));
      return orders[index];
    },
  },
  
  // Bulletin endpoints
  bulletin: {
    getAll: async () => {
      return JSON.parse(localStorage.getItem("bulletinPosts") || "[]");
    },
    
    create: async (postData) => {
      const posts = JSON.parse(localStorage.getItem("bulletinPosts") || "[]");
      const user = JSON.parse(localStorage.getItem("user") || "null");
      
      const newPost = {
        id: Date.now(),
        ...postData,
        author: user?.name,
        authorRole: user?.role,
        createdAt: new Date().toISOString().split("T")[0],
        comments: 0,
        likes: 0,
      };
      
      posts.unshift(newPost);
      localStorage.setItem("bulletinPosts", JSON.stringify(posts));
      return newPost;
    },
    
    like: async (id) => {
      const posts = JSON.parse(localStorage.getItem("bulletinPosts") || "[]");
      const index = posts.findIndex(p => p.id === parseInt(id));
      
      if (index === -1) {
        throw new Error("Post not found");
      }
      
      posts[index].likes += 1;
      localStorage.setItem("bulletinPosts", JSON.stringify(posts));
      return posts[index];
    },
  },
  
  // Ratings endpoints
  ratings: {
    create: async (ratingData) => {
      const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
      const newRating = {
        id: Date.now(),
        ...ratingData,
        createdAt: new Date().toISOString().split("T")[0],
      };
      
      ratings.push(newRating);
      localStorage.setItem("ratings", JSON.stringify(ratings));
      
      // Update seller rating
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex(u => u.id === ratingData.sellerId);
      
      if (userIndex !== -1) {
        const userRatings = ratings.filter(r => r.sellerId === ratingData.sellerId);
        const average = userRatings.reduce((sum, r) => sum + r.rating, 0) / userRatings.length;
        users[userIndex].rating = Math.round(average * 10) / 10;
        users[userIndex].totalReviews = userRatings.length;
        localStorage.setItem("users", JSON.stringify(users));
      }
      
      return newRating;
    },
    
    getBySeller: async (sellerId) => {
      const ratings = JSON.parse(localStorage.getItem("ratings") || "[]");
      return ratings.filter(r => r.sellerId === sellerId);
    },
  },
};

export default api;