import { fetchFactory } from "@/fetchFactory";
import z from "zod";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export const BlogSchema = z.object({
    id: z.number(),
    categoryId: z.number(),
    title: z.string(),
    description: z.string(),
    coverPhoto: z.string().optional(),
    content: z.string(),
    visibility: z.boolean(),
    createdAt: z.date(),
    updatedAt: z.date(),
})

export type BlogProps = z.infer<typeof BlogSchema>

export const CreateBlogSchema = z.object({
    categoryId: z.string(),
    title: z.string(),
    description: z.string(),
    coverPhoto: z.string().optional(),
    content: z.string(),
    visibility: z.boolean()
}).transform(val => ({
    ...val,
    categoryId: Number(val.categoryId)
}))

export type CreateBlogProps = z.infer<typeof CreateBlogSchema>

export type UpdateBlogProps = CreateBlogProps

export type Pagination<T> = {
    data: T[]
    pagination: {
        page: number,
        limit: number,
        total: number,
        totalPages: number
    }
}

export async function createBlog(blog: CreateBlogProps) {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog`, {
        method: "POST",
        body: JSON.stringify(blog),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Internal server error");

    const data: { id: number } = await res.json();

    return data;
}

export async function getBlogs(page: number, limit: number): Promise<Pagination<BlogProps>> {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog?page=${page}&limit=${limit}`)
    if (!res.ok) {
        if (res.status === 404) throw new Error("Data not found.");
        throw new Error("Internal server error")
    }

    return await res.json()
}

export async function getBlogById(blogId: number): Promise<BlogProps> {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog/${blogId}`)
    if (!res.ok) {
        if (res.status === 404) throw new Error("Data not found.");
        throw new Error("Internal server error")
    }

    return await res.json()
}

export async function updateBlog(blogId: number, blog: UpdateBlogProps) {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog/${blogId}`, {
        method: "PUT",
        body: JSON.stringify(blog),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Internal server error");

    const data: { id: number } = await res.json();

    return data;
}

export const CreateBlogCategorySchema = z.object({
    slug: z.string(),
    name: z.string(),
    visibility: z.boolean(),
})

export type CreateBlogCategoryProps = z.infer<typeof CreateBlogCategorySchema>

export type UpdateBlogCategoryProps = CreateBlogCategoryProps

export const BlogCategorySchema = z.object({
    id: z.number(),
    slug: z.string(),
    name: z.string(),
    visibility: z.boolean(),
})

export type BlogCategoryProps = z.infer<typeof BlogCategorySchema>

export async function createBlogCategory(blogCategory: CreateBlogCategoryProps) {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog-categories`, {
        method: "POST",
        body: JSON.stringify(blogCategory),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Internal server error");

    const data: { id: number } = await res.json();

    return data;
}

export async function getBlogCategories(): Promise<BlogCategoryProps[]> {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog-categories`)
    if (!res.ok) {
        if (res.status === 404) throw new Error("Data not found.");
        throw new Error("Internal server error")
    }

    return await res.json()
}

export async function getBlogCategoryById(blogCategoryId: number): Promise<BlogCategoryProps> {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog-categories/${blogCategoryId}`)
    if (!res.ok) {
        if (res.status === 404) throw new Error("Data not found.");
        throw new Error("Internal server error")
    }

    return await res.json()
}

export async function updateBlogCategory(blogCategoryId: number, blogCategory: UpdateBlogCategoryProps) {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog-categories/${blogCategoryId}`, {
        method: "PUT",
        body: JSON.stringify(blogCategory),
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Internal server error");

    const data: { id: number } = await res.json();

    return data;
}

export async function deleteBlogCategory(blogCategoryId: number) {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/blog-categories/${blogCategoryId}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (!res.ok) throw new Error("Internal server error");

    return await res.json()
}