// src/features/blog/hooks/useBlogsQuery.ts

import { useQuery } from '@tanstack/react-query';
import client from '../api/axios.client';
import { API_ROUTES } from '../config/constants';
import type { Blog } from '../types';

// Fetch de todos los blogs
const fetchBlogs = async (): Promise<Blog[]> => {
    const { data } = await client.get(API_ROUTES.BLOGS);
    return data.data.blogs;
};

// Fetch de un solo blog por ID
const fetchBlogById = async (id: string): Promise<Blog> => {
    const { data } = await client.get(`${API_ROUTES.BLOGS}/${id}`);
    return data.data.blog;
};

// --- HOOKS ---

export const useBlogsQuery = () => {
    return useQuery<Blog[], Error>({
        queryKey: ['blogs'],
        queryFn: fetchBlogs,
        staleTime: 1000 * 60 * 5, // 5 minutos de caché
    });
};

export const useBlogByIdQuery = (id: string | undefined) => {
    return useQuery<Blog, Error>({
        queryKey: ['blog', id],
        queryFn: () => fetchBlogById(id!),
        enabled: !!id, // Solo ejecuta si hay ID
        retry: 1, // No reintentar infinitamente si no existe
    });
};