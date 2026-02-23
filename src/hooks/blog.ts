import { createBlog, createBlogCategory, deleteBlogCategory, getBlogById, getBlogCategories, getBlogCategoryById, getBlogs, updateBlog, updateBlogCategory, UpdateBlogCategoryProps, UpdateBlogProps } from "@/features/wordpress/blog.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetBlogs(page: number, limit: number) {
    return useQuery({
        queryKey: ["blogs", `page:${page}`, `limit:${limit}`],
        queryFn: () => getBlogs(page, limit)
    })
}

export function useGetBlogById(blogId: number) {
    return useQuery({
        queryKey: ["blogs", blogId],
        queryFn: () => getBlogById(blogId)
    })
}

export function useCreateBlog() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createBlog,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] })
    })
}

export function useUpdateBlog(blogId: number) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (data: UpdateBlogProps) => updateBlog(blogId, data),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["blogs"] })
    })
}

export function useGetAllBlogCategories() {
    return useQuery({
        queryKey: ["blog_categories"],
        queryFn: () => getBlogCategories(),
        refetchOnWindowFocus: false,
        refetchOnReconnect: false
    })
}

export function useGetBlogCategoryById(blogCategoryId: number) {
    return useQuery({
        queryKey: ["blogs", blogCategoryId],
        queryFn: () => getBlogCategoryById(blogCategoryId)
    })
}

export function useCreateBlogCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: createBlogCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["blog_categories"] })
    })
}

export function useUpdateBlogCategory(blogCategoryId: number) {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: (blogCategory: UpdateBlogCategoryProps) => updateBlogCategory(blogCategoryId, blogCategory),
        onSuccess: () => qc.invalidateQueries({ queryKey: ["blog_categories"] })
    })
}

export function useDeleteBlogCategory() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteBlogCategory,
        onSuccess: () => qc.invalidateQueries({ queryKey: ["blog_categories"] })
    })
}