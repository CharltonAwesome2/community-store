import {
  FaBook,
  FaLaptop,
  FaChair,
  FaTshirt,
  FaWrench,
  FaBullhorn,
  FaPizzaSlice,
  FaBox,
} from "react-icons/fa";

export const categories = [
  { id: "textbooks",   name: "Textbooks",        Icon: FaBook },
  { id: "electronics", name: "Electronics",      Icon: FaLaptop },
  { id: "furniture",   name: "Furniture",        Icon: FaChair },
  { id: "clothing",    name: "Clothing",         Icon: FaTshirt },
  { id: "services",    name: "Services",         Icon: FaWrench },
  { id: "events",      name: "Events",           Icon: FaBullhorn },
  { id: "food",        name: "Food & Groceries", Icon: FaPizzaSlice },
  { id: "other",       name: "Other",            Icon: FaBox },
];

export const conditions = [
  "New",
  "Like New",
  "Good",
  "Fair",
  "Poor",
];

export const userRoles = {
  STUDENT: "student",
  VENDOR: "vendor",
  FACULTY: "faculty",
  RESIDENT: "resident",
  ADMIN: "admin",
};