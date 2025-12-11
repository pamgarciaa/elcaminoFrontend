import { useQuery } from "@tanstack/react-query";
import client from "../../../../api/axios.client";
import { API_ROUTES } from "../../../../config/constants";
import { type Product } from "../../products/types/productTypes";

const fetchKits = async (): Promise<Product[]> => {
  const { data } = await client.get(API_ROUTES.KITS);
  return data.data.kits;
};

export const useKitsQuery = () => {
  return useQuery<Product[], Error>({
    queryKey: ["kits"],
    queryFn: fetchKits,
  });
};
