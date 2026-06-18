// Helper functions for localStorage operations

export const storage = {
  // Generic get/set/remove
  get: (key, defaultValue = null) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (error) {
      console.error(`Error getting ${key} from localStorage:`, error);
      return defaultValue;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting ${key} in localStorage:`, error);
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing ${key} from localStorage:`, error);
    }
  },
  
  clear: () => {
    try {
      localStorage.clear();
    } catch (error) {
      console.error("Error clearing localStorage:", error);
    }
  },
  
  // User specific storage
  user: {
    get: () => storage.get("user"),
    set: (user) => storage.set("user", user),
    remove: () => storage.remove("user"),
    getToken: () => storage.get("authToken"),
    setToken: (token) => storage.set("authToken", token),
    removeToken: () => storage.remove("authToken"),
    isAuthenticated: () => {
      return !!storage.get("user") && !!storage.get("authToken");
    },
  },
  
  // Cart storage
  cart: {
    get: () => storage.get("cart", []),
    set: (items) => storage.set("cart", items),
    add: (item) => {
      const cart = storage.cart.get();
      const existing = cart.find(i => i.id === item.id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ ...item, quantity: 1 });
      }
      
      storage.cart.set(cart);
      return cart;
    },
    remove: (productId) => {
      const cart = storage.cart.get();
      const filtered = cart.filter(i => i.id !== productId);
      storage.cart.set(filtered);
      return filtered;
    },
    updateQuantity: (productId, quantity) => {
      const cart = storage.cart.get();
      const item = cart.find(i => i.id === productId);
      
      if (item) {
        if (quantity <= 0) {
          return storage.cart.remove(productId);
        }
        item.quantity = quantity;
        storage.cart.set(cart);
      }
      
      return cart;
    },
    clear: () => {
      storage.cart.set([]);
    },
    getTotal: () => {
      const cart = storage.cart.get();
      return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    getCount: () => {
      const cart = storage.cart.get();
      return cart.reduce((sum, item) => sum + item.quantity, 0);
    },
  },
  
  // Product storage
  products: {
    getAll: () => storage.get("products", []),
    getById: (id) => {
      const products = storage.products.getAll();
      return products.find(p => p.id === parseInt(id));
    },
    add: (product) => {
      const products = storage.products.getAll();
      const newProduct = {
        id: Date.now(),
        ...product,
        createdAt: new Date().toISOString().split("T")[0],
        status: "active",
      };
      products.push(newProduct);
      storage.set("products", products);
      return newProduct;
    },
    update: (id, updates) => {
      const products = storage.products.getAll();
      const index = products.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        products[index] = { ...products[index], ...updates };
        storage.set("products", products);
        return products[index];
      }
      return null;
    },
    delete: (id) => {
      const products = storage.products.getAll();
      const filtered = products.filter(p => p.id !== parseInt(id));
      storage.set("products", filtered);
      return filtered;
    },
    getBySeller: (sellerId) => {
      const products = storage.products.getAll();
      return products.filter(p => p.seller.id === sellerId);
    },
  },
  
  // Order storage
  orders: {
    getAll: () => storage.get("orders", []),
    getById: (id) => {
      const orders = storage.orders.getAll();
      return orders.find(o => o.id === parseInt(id));
    },
    getByUser: (userId) => {
      const orders = storage.orders.getAll();
      return orders.filter(o => o.buyerId === userId);
    },
    getBySeller: (sellerName) => {
      const orders = storage.orders.getAll();
      return orders.filter(o => o.seller === sellerName);
    },
    add: (order) => {
      const orders = storage.orders.getAll();
      const newOrder = {
        id: Date.now(),
        ...order,
        status: "pending",
        createdAt: new Date().toISOString().split("T")[0],
      };
      orders.push(newOrder);
      storage.set("orders", orders);
      return newOrder;
    },
    updateStatus: (id, status) => {
      const orders = storage.orders.getAll();
      const index = orders.findIndex(o => o.id === parseInt(id));
      if (index !== -1) {
        orders[index].status = status;
        storage.set("orders", orders);
        return orders[index];
      }
      return null;
    },
  },
  
  // Bulletin storage
  bulletin: {
    getAll: () => storage.get("bulletinPosts", []),
    getById: (id) => {
      const posts = storage.bulletin.getAll();
      return posts.find(p => p.id === parseInt(id));
    },
    add: (post) => {
      const posts = storage.bulletin.getAll();
      const newPost = {
        id: Date.now(),
        ...post,
        comments: 0,
        likes: 0,
        createdAt: new Date().toISOString().split("T")[0],
      };
      posts.unshift(newPost);
      storage.set("bulletinPosts", posts);
      return newPost;
    },
    like: (id) => {
      const posts = storage.bulletin.getAll();
      const index = posts.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        posts[index].likes += 1;
        storage.set("bulletinPosts", posts);
        return posts[index];
      }
      return null;
    },
    addComment: (id, comment) => {
      const posts = storage.bulletin.getAll();
      const index = posts.findIndex(p => p.id === parseInt(id));
      if (index !== -1) {
        posts[index].comments += 1;
        storage.set("bulletinPosts", posts);
        return posts[index];
      }
      return null;
    },
  },
  
  // Ratings storage
  ratings: {
    getAll: () => storage.get("ratings", []),
    getBySeller: (sellerId) => {
      const ratings = storage.ratings.getAll();
      return ratings.filter(r => r.sellerId === sellerId);
    },
    add: (rating) => {
      const ratings = storage.ratings.getAll();
      const newRating = {
        id: Date.now(),
        ...rating,
        createdAt: new Date().toISOString().split("T")[0],
      };
      ratings.push(newRating);
      storage.set("ratings", ratings);
      
      // Update seller's average rating
      const sellerRatings = ratings.filter(r => r.sellerId === rating.sellerId);
      const average = sellerRatings.reduce((sum, r) => sum + r.rating, 0) / sellerRatings.length;
      
      const users = storage.get("users", []);
      const userIndex = users.findIndex(u => u.id === rating.sellerId);
      if (userIndex !== -1) {
        users[userIndex].rating = Math.round(average * 10) / 10;
        users[userIndex].totalReviews = sellerRatings.length;
        storage.set("users", users);
      }
      
      return newRating;
    },
  },
  
  // User management
  users: {
    getAll: () => storage.get("users", []),
    getById: (id) => {
      const users = storage.users.getAll();
      return users.find(u => u.id === id);
    },
    getByEmail: (email) => {
      const users = storage.users.getAll();
      return users.find(u => u.email === email);
    },
    add: (user) => {
      const users = storage.users.getAll();
      const newUser = {
        id: Date.now(),
        ...user,
        joinDate: new Date().toISOString().split("T")[0],
        rating: 0,
        totalReviews: 0,
        isActive: true,
      };
      users.push(newUser);
      storage.set("users", users);
      return newUser;
    },
    update: (id, updates) => {
      const users = storage.users.getAll();
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index] = { ...users[index], ...updates };
        storage.set("users", users);
        return users[index];
      }
      return null;
    },
    verify: (id) => {
      const users = storage.users.getAll();
      const index = users.findIndex(u => u.id === id);
      if (index !== -1) {
        users[index].verified = true;
        storage.set("users", users);
        return users[index];
      }
      return null;
    },
  },
};

export default storage;