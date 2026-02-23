import { fetchFactory } from "@/fetchFactory"
import z from "zod";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export const AssetSchema = z.object({
    id: z.number(),
    name: z.string().optional(),
    url: z.string(),
    createdAt: z.date(),
    updatedAt: z.date()
})

export type AssetProps = z.infer<typeof AssetSchema>

export const CreateAssetRequestSchema = z.object({
    name: z.string().optional(),
    file: z.file()
})

export type CreateAssetRequestForm = z.infer<typeof CreateAssetRequestSchema>

export async function getAllAssets(): Promise<AssetProps[]> {
    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/assets`)
    if (!res.ok) {
        if (res.status === 404) throw new Error("Data not found.");
        throw new Error("Internal server error")
    }

    return await res.json()
}

export async function createAsset(data: CreateAssetRequestForm): Promise<AssetProps> {

    const form = new FormData();
    if (data.name) form.append("name", data.name)
    form.append('file', data.file)

    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/assets`, {
        method: "POST",
        body: form,
    })
    if (!res.ok) throw new Error("Internal server error");

    return await res.json()
}

export async function deleteAsset(id: number) {

    const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/assets/${id}`, {
        method: "DELETE"
    })
    if (!res.ok) throw new Error("Internal server error");

    return await res.json()
}

