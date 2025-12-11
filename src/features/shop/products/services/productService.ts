import client from "../../../../api/axios.client";
import { API_ROUTES } from "../../../../config/constants";
import { type Product } from "../types/productTypes";

interface CreateProductParams {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  image: File;
}

export const productService = {
  getAll: async (): Promise<Product[]> => {
    const { data } = await client.get(API_ROUTES.PRODUCTS);
    return data.data.products;
  },
  create: async (params: CreateProductParams): Promise<Product> => {
    const formData = new FormData();
    formData.append("name", params.name);
    formData.append("description", params.description);
    formData.append("price", String(params.price));
    formData.append("stock", String(params.stock));
    formData.append("category", params.category);
    formData.append("productImage", params.image);

    const { data } = await client.post(API_ROUTES.PRODUCTS, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data;
  },
};
