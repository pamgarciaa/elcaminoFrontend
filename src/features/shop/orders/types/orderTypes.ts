import type { Product } from "../../products/types/productTypes";

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
  status: "pending" | "paid" | "shipped" | "delivered";
  createdAt: string;
}
