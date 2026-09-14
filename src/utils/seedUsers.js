// src/utils/seedUsers.js
export const DEMO_ACCOUNTS = [
  {
    id: "u-student-1",
    name: "Test Student",
    email: "student@cput.ac.za",
    password: "password123",
    role: "student",
  },
  {
    id: "u-vendor-1",
    name: "Test Vendor",
    email: "vendor@trusthive.com",
    password: "password123",
    role: "vendor",
    businessName: "Test Vendor Co",
    businessRegistration: "REG-12345",
  },
  {
    id: "u-admin-1",
    name: "Test Admin",
    email: "admin@trusthive.com",
    password: "password123",
    role: "admin",
  },
  {
    id: "u-faculty-1",
    name: "Test Faculty",
    email: "faculty@cput.ac.za",
    password: "password123",
    role: "faculty",
  },
  {
    id: "u-resident-1",
    name: "Test Resident",
    email: "resident@trusthive.com",
    password: "password123",
    role: "resident",
  },
];

export const seedDefaultUsers = () => {
  const existing = JSON.parse(localStorage.getItem("users") || "[]");
  if (existing.length > 0) return;

  localStorage.setItem("users", JSON.stringify(DEMO_ACCOUNTS));
  console.log("✅ Seeded default users");
};