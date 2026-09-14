// src/utils/mappers.js

/**
 * Convert a Supabase `users` row into the app's user shape.
 * Your components expect: { id, name, email, role, verified, rating, totalReviews, ... }
 */
export const mapUser = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    legacyId: row.legacy_id,
    email: row.email,
    name: row.name,
    role: row.role,
    avatar: row.avatar,
    campus: row.campus,
    bio: row.bio,
    businessName: row.business_name,
    businessRegistration: row.business_registration,
    verified: row.verified,
    rating: Number(row.rating) || 0,
    totalReviews: row.total_reviews || 0,
    isActive: row.is_active,
    joinDate: row.join_date,
  };
};

/**
 * Convert a Supabase `products` row into the app's product shape.
 * Reconstructs the nested `seller` object your JSX already reads.
 */
export const mapProduct = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    price: Number(row.price),
    category: row.category,
    condition: row.condition,
    location: row.location,
    images: row.images || [],
    status: row.status,
    createdAt: row.created_at,
    seller: {
      id: row.seller_id,
      name: row.seller_name,
      rating: Number(row.seller_rating) || 0,
      verified: row.seller_verified,
    },
  };
};

/**
 * Convert a Supabase `bulletin_posts` row into the app's post shape.
 */
export const mapPost = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    content: row.content,
    category: row.category,
    author: row.author_name,
    authorRole: row.author_role,
    authorId: row.author_id,
    likes: row.likes || 0,
    comments: row.comments || 0,
    createdAt: row.created_at,
  };
};

/**
 * Convert a Supabase `orders` row into the app's order shape.
 */
export const mapOrder = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    buyer: row.buyer_name,
    buyerId: row.buyer_id,
    buyerEmail: row.buyer_email,
    seller: row.seller_name,
    items: row.items || [],
    total: Number(row.total),
    status: row.status,
    paymentMethod: row.payment_method,
    transactionId: row.transaction_id,
    createdAt: row.created_at,
  };
};

/**
 * Convert a Supabase `notifications` row into the app's notification shape.
 */
export const mapNotification = (row) => {
  if (!row) return null;
  return {
    id: row.id,
    title: row.title,
    message: row.message,
    read: row.read,
    createdAt: row.created_at,
  };
};