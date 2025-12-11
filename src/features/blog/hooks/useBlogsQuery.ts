import { useQuery } from "@tanstack/react-query";
import {
  getAllBlogsService,
  getBlogByIdService,
} from "../services/blogServices";
import type { Blog } from "../types/blogTypes";

export const useBlogsQuery = () => {
  return useQuery<Blog[], Error>({
    queryKey: ["blogs"],
    queryFn: getAllBlogsService,
  });
};

export const useBlogByIdQuery = (id: string | undefined) => {
  return useQuery<Blog, Error>({
    queryKey: ["blog", id],
    queryFn: () => getBlogByIdService(id!),
    enabled: !!id,
  });
};
