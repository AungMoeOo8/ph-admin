import { supabase } from "./supabaseConfig";

type FileResponseType = {
    isSuccess: boolean;
    message: string;
    url?: string;
};

/**
 * Uploads a file to Supabase storage.
 */
export async function uploadFile(folderName: string, file: File): Promise<FileResponseType> {
    try {
        const { data, error } = await supabase.storage
            .from("org_images")
            .upload(`${folderName}/${file.name}`, file);

        if (error) {
            return { isSuccess: false, message: error.message };
        }

        const { data: publicUrlData } = supabase.storage.from("org_images").getPublicUrl(data.path);

        return { isSuccess: true, message: "Uploading successful.", url: publicUrlData.publicUrl };
    } catch {
        return { isSuccess: false, message: "Uploading failed." };
    }
}

/**
 * Deletes a file from Supabase storage.
 */
export async function deleteFile(filePath: string): Promise<FileResponseType> {
    try {
        const { error } = await supabase.storage.from("org_images").remove([filePath]);

        if (error) {
            return { isSuccess: false, message: error.message };
        }

        return { isSuccess: true, message: "Deleting successful." };
    } catch {
        return { isSuccess: false, message: "Deleting failed." };
    }
}
