import { useQuery } from "@tanstack/react-query";
import { productService } from "../services/productService";
import type { Product } from "../types/productTypes";

export const useProductsQuery = () => {
  return useQuery<Product[], Error>({
    queryKey: ["allProducts"],
    queryFn: productService.getAll,
    staleTime: 1000 * 60 * 5,
  });
};
