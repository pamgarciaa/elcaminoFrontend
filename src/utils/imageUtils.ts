import { IMAGE_URL } from "../config/constants";

export const getImageUrl = (path: string | undefined | null): string => {
  if (!path) return "/placeholder.jpg";
  if (path.startsWith("http")) return path;

  return `${IMAGE_URL}/${path.replace(/\\/g, "/")}`;
};

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
