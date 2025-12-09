// src/types/index.ts

export interface User {
  _id: string;
  username: string;
  name: string;
  lastName: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  profilePicture?: string;
  address?: string;
  phone?: string;
}

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: string;
}

export interface Blog {
  _id: string;
  title: string;
  content: string;
  image: string;
  author: User; 
  createdAt: string;
}

// Interfaces de Carrito y Ordenes
export interface CartItem {
  product: Product;
  quantity: number;
  _id: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
}

export interface OrderItem {
  product: Product;
  quantity: number;
  priceAtPurchase: number;
  _id: string;
}

export interface Order {
  _id: string;
  items: OrderItem[];
  totalAmount: number;
  status: 'pending' | 'paid' | 'shipped' | 'delivered';
  createdAt: string;
}