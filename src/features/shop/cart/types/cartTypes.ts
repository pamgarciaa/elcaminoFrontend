import type { Product } from "../../products/types/productTypes";
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
