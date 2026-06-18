export const mockProducts = [
  {
    id: 1,
    title: "Calculus Textbook - 3rd Edition",
    description: "Used for first year engineering students. Excellent condition with no markings.",
    price: 350,
    category: "textbooks",
    condition: "Like New",
    seller: {
      id: 1,
      name: "John Doe",
      rating: 4.5,
      verified: true,
    },
    images: ["textbook1.jpg"],
    location: "Cape Town Campus",
    createdAt: "2024-03-01",
    status: "active",
  },
  {
    id: 2,
    title: "Gaming Laptop - MSI GF63",
    description: "15.6 inch, i7 processor, 16GB RAM, 512GB SSD. Great condition, barely used.",
    price: 8500,
    category: "electronics",
    condition: "Good",
    seller: {
      id: 2,
      name: "TechStore SA",
      rating: 4.8,
      verified: true,
    },
    images: ["laptop1.jpg", "laptop2.jpg"],
    location: "Bellville Campus",
    createdAt: "2024-03-10",
    status: "active",
  },
  // Add more mock products
];

export const mockBulletinPosts = [
  {
    id: 1,
    title: "Campus Career Fair 2024",
    content: "Join us for the annual campus career fair on April 15th. All students welcome!",
    author: "Career Services",
    authorRole: "admin",
    category: "events",
    createdAt: "2024-03-15",
    comments: 8,
    likes: 23,
  },
  {
    id: 2,
    title: "Student Tutor Wanted - Programming 101",
    content: "Looking for a student tutor for Programming 101. Must have passed with distinction.",
    author: "Jane Smith",
    authorRole: "faculty",
    category: "services",
    createdAt: "2024-03-14",
    comments: 3,
    likes: 12,
  },
];

export const mockOrders = [
  {
    id: 1,
    buyer: "John Doe",
    seller: "TechStore SA",
    items: [
      { productId: 2, title: "Gaming Laptop", quantity: 1, price: 8500 }
    ],
    total: 8500,
    status: "completed",
    createdAt: "2024-03-12",
    paymentMethod: "PayFast",
    transactionId: "TRX-2024-001",
  },
];