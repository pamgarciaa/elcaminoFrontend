import client from "../../../api/axios.client";
import { type CreateBlogFields } from "../validators/blogSchema";
import { type Blog } from "../types/blogTypes";

export const getAllBlogsService = async (): Promise<Blog[]> => {
  const response = await client.get("/blogs");
  return response.data.data.blogs;
};

// --- OBTENER BLOG POR ID ---
export const getBlogByIdService = async (id: string): Promise<Blog> => {
  const response = await client.get(`/blogs/${id}`);
  return response.data.data.blog;
};

export const createBlogService = async (data: CreateBlogFields, file: File) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);
  formData.append("blogImage", file);

  const response = await client.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const updateBlogService = async (
  id: string,
  data: CreateBlogFields,
  file: File | null
) => {
  const formData = new FormData();
  formData.append("title", data.title);
  formData.append("content", data.content);

  if (file) {
    formData.append("blogImage", file);
  }

  const response = await client.patch(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const deleteBlogService = async (id: string) => {
  const response = await client.delete(`/blogs/${id}`);
  return response.data;
};
