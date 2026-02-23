import {
    createAsset,
    CreateAssetRequestForm,
    deleteAsset,
    getAllAssets,
} from "@/features/wordpress/asset.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllAssets() {
    return useQuery({
        queryKey: ["assets"],
        queryFn: getAllAssets,
    });
}

export function useCreateAsset() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: async (data: CreateAssetRequestForm) => createAsset(data),
        onSuccess: async () => await qc.invalidateQueries({ queryKey: ["assets"] })
    });
}

export function useDeleteAsset() {
    const qc = useQueryClient()
    return useMutation({
        mutationFn: deleteAsset,
        onSuccess: async () => await qc.invalidateQueries({ queryKey: ["assets"] })
    });
}