
## **Program Flow - Community Store**

### **High-Level Architecture**

```
┌─────────────────────────────────────────────────────────────┐
│                    USER INTERFACE LAYER                      │
├─────────────────────────────────────────────────────────────┤
│  Pages: Home, Marketplace, ProductDetail, Cart, Checkout   │
│  Components: Layout, Card, ProductList, RatingSystem       │
│  Context: AuthContext, CartContext, NotificationContext    │
├─────────────────────────────────────────────────────────────┤
│                    SERVICE LAYER                            │
├─────────────────────────────────────────────────────────────┤
│  api.js (Axios + Mock API)  │  localStorage.js (Storage)   │
├─────────────────────────────────────────────────────────────┤
│                    DATA LAYER                               │
├─────────────────────────────────────────────────────────────┤
│  localStorage (Browser)  │  Mock Data  │  Categories       │
└─────────────────────────────────────────────────────────────┘
```

---

### **User Journey Flows**

#### **1. Registration Flow**

```
START
  │
  ▼
[User visits /register]
  │
  ▼
[Fill registration form]
  │
  ├─── Student: Requires @cput.ac.za email
  ├─── Vendor: Requires business name + registration number
  ├─── Faculty: Standard registration
  └─── Resident: Standard registration
  │
  ▼
[Submit form]
  │
  ▼
[Validation checks]
  │
  ├─── Email already exists? → Show error
  ├─── Student email valid? → Show error
  └─── All fields filled? → Proceed
  │
  ▼
[Create user in localStorage]
  │
  ▼
[Set user in AuthContext]
  │
  ▼
[Redirect to Home page]
  │
  ▼
END
```

---

#### **2. Login Flow**

```
START
  │
  ▼
[User visits /login]
  │
  ▼
[Enter email + password]
  │
  ▼
[Submit form]
  │
  ▼
[Check credentials]
  │
  ├─── User exists? → Proceed
  └─── Invalid credentials → Show error
  │
  ▼
[Set user in AuthContext]
  │
  ▼
[Redirect to Home page]
  │
  ▼
END
```

---

#### **3. Product Listing & Browsing Flow**

```
START
  │
  ▼
[User visits /marketplace]
  │
  ▼
[Load products from localStorage]
  │
  ▼
[Apply filters]
  │
  ├─── Search by title/description
  ├─── Filter by category
  ├─── Price range (min/max)
  └─── Sort by (newest, price, rating)
  │
  ▼
[Display filtered products]
  │
  ▼
[User clicks a product]
  │
  ▼
[Navigate to /product/:id]
  │
  ▼
[Load product details]
  │
  ▼
[Display product info]
  │
  ├─── Add to cart (if logged in)
  ├─── Wishlist (future feature)
  └─── Edit/Delete (if seller/owner)
  │
  ▼
END
```

---

#### **4. Shopping Cart Flow**

```
START
  │
  ▼
[User adds product to cart]
  │
  ▼
[CartContext.addToCart()]
  │
  ▼
[Product exists in cart?]
  │
  ├─── Yes → Increase quantity
  └─── No → Add new item
  │
  ▼
[Update cart in localStorage]
  │
  ▼
[Badge updates on header]
  │
  ▼
[User visits /cart]
  │
  ▼
[Display cart items]
  │
  ├─── Update quantity (+ / -)
  ├─── Remove item
  └─── Clear all items
  │
  ▼
[Click "Proceed to Checkout"]
  │
  ▼
[Check if user is logged in]
  │
  ├─── Yes → Navigate to /checkout
  └─── No → Redirect to /login
  │
  ▼
END
```

---

#### **5. Checkout & Payment Flow**

```
START
  │
  ▼
[User visits /checkout]
  │
  ▼
[Display order summary]
  │
  ▼
[Select payment method]
  │
  ├─── PayPal
  │       │
  │       ▼
  │   [PayPalButtons rendered]
  │       │
  │       ▼
  │   [User clicks PayPal]
  │       │
  │       ▼
  │   [createOrder() - PayPal API]
  │       │
  │       ▼
  │   [User completes payment]
  │       │
  │       ▼
  │   [onApprove() - Capture order]
  │       │
  │       ▼
  │   [Save order to localStorage]
  │       │
  │       ▼
  │   [Clear cart]
  │       │
  │       ▼
  │   [Show success message]
  │       │
  │       ▼
  │   [Navigate to /orders]
  │
  └─── Test Payment
          │
          ▼
      [Click "Place Test Order"]
          │
          ▼
      [Processing... 1.5s delay]
          │
          ▼
      [Save order to localStorage]
          │
          ▼
      [Clear cart]
          │
          ▼
      [Show success message]
          │
          ▼
      [Navigate to /orders]
  │
  ▼
END
```

---

#### **6. Bulletin Board Flow**

```
START
  │
  ▼
[User visits /bulletin]
  │
  ▼
[Load posts from localStorage]
  │
  ▼
[Filter by category]
  │
  ├─── All
  ├─── Events
  ├─── Services
  ├─── Announcements
  └─── Promotions
  │
  ▼
[Display posts]
  │
  ▼
[User clicks "Create Post"]
  │
  ▼
[Check if logged in]
  │
  ├─── Yes → Navigate to /bulletin/create
  └─── No → Redirect to /login
  │
  ▼
[Fill post form]
  │
  ▼
[Submit]
  │
  ▼
[Save to localStorage]
  │
  ▼
[Redirect to /bulletin]
  │
  ▼
END
```

---

#### **7. Admin Dashboard Flow**

```
START
  │
  ▼
[User visits /admin/dashboard]
  │
  ▼
[Check if user is admin]
  │
  ├─── Yes → Load dashboard
  └─── No → Redirect to home
  │
  ▼
[Load statistics]
  │
  ├─── Total users
  ├─── Total products
  ├─── Total orders
  └─── Pending verifications
  │
  ▼
[Display stats cards]
  │
  ▼
[Show recent activity]
  │
  ▼
[Quick actions]
  │
  ├─── Verify Users
  ├─── Moderate Listings
  ├─── View Reports
  └─── Manage Flags
  │
  ▼
END
```

---

#### **8. Vendor Dashboard Flow**

```
START
  │
  ▼
[User visits /vendor/dashboard]
  │
  ▼
[Check if user is vendor]
  │
  ├─── Yes → Load dashboard
  └─── No → Redirect to home
  │
  ▼
[Load vendor data]
  │
  ├─── My listings
  ├─── Recent orders
  ├─── Total sales
  └─── Revenue
  │
  ▼
[Display stats]
  │
  ▼
[Show listing management]
  │
  ├─── Create new listing
  ├─── Edit listing
  └─── Delete listing
  │
  ▼
[Show recent orders]
  │
  ▼
END
```

---

### **Data Flow Diagram**

```
┌─────────────────────┐
│   User Actions      │
│  (Click, Type, etc) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   React Components  │
│  (UI Rendering)     │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Context Providers │
│  (Auth, Cart, Notif)│
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   Service Layer     │
│  (api.js / storage) │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│   localStorage      │
│  (Data Persistence) │
└─────────────────────┘
```

---

### **State Management Flow**

```
┌─────────────────────────────────────────────────────────────┐
│                    APPLICATION STATE                        │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  AuthContext          │  CartContext    │  NotificationCtx  │
│  ├── user             │  ├── items      │  ├── notifications│
│  ├── loading          │  ├── addToCart  │  ├── preferences  │
│  ├── login()          │  ├── remove     │  ├── addNotif()   │
│  ├── register()       │  ├── update     │  └── markRead()   │
│  └── logout()         │  └── clear      │                   │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│                    PERSISTED STATE                          │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  localStorage:                                              │
│  ├── user (current user)                                   │
│  ├── authToken (auth token)                               │
│  ├── cart (cart items)                                    │
│  ├── users (all users)                                    │
│  ├── products (all products)                              │
│  ├── orders (all orders)                                  │
│  ├── bulletinPosts (all posts)                            │
│  ├── ratings (all ratings)                                │
│  └── notification_prefs_* (user preferences)              │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

### **Key User Flows Summary**

| Feature | Path | Auth Required | Description |
|---------|------|--------------|-------------|
| Home | `/` | No | Landing page with featured items |
| Register | `/register` | No | Create new account |
| Login | `/login` | No | Login to account |
| Marketplace | `/marketplace` | No | Browse and filter products |
| Product Detail | `/product/:id` | No | View product details |
| Create Listing | `/create-listing` | Yes | Sellers create new listings |
| Cart | `/cart` | No | View and manage cart |
| Checkout | `/checkout` | Yes | Checkout with PayPal/test payment |
| Bulletin | `/bulletin` | No | View community posts |
| Create Post | `/bulletin/create` | Yes | Create bulletin post |
| Admin Dashboard | `/admin/dashboard` | Yes (Admin) | Admin management |
| Vendor Dashboard | `/vendor/dashboard` | Yes (Vendor) | Vendor management |
| About | `/about` | No | About page |

---

### **Role-Based Access Control**

```
┌─────────────────────────────────────────────────────────────┐
│                     USER ROLES                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  STUDENT          │  VENDOR         │  FACULTY    │ ADMIN  │
│  ├── Browse       │  ├── Browse     │  ├── Browse │  ├── All│
│  ├── Buy          │  ├── Buy        │  ├── Buy    │  ├── Mod│
│  ├── Rate         │  ├── Sell       │  ├── Rate   │  ├── Ver│
│  └── Post         │  ├── Dashboard  │  └── Post   │  └── Rep│
│                   │  └── Analytics  │             │        │
│                                                             │
│  RESIDENT         │                                        │
│  ├── Browse       │                                        │
│  ├── Buy          │                                        │
│  └── Post         │                                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```
