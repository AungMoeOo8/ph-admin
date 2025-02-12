import { supabase } from "./supabaseConfig";

type FileResponseType = {
    isSuccess: boolean,
    message: string,
    url: string
}

export async function uploadFile(folderName: string, file: File) {
    try {
        const uploadResponse = await supabase
            .storage
            .from("org_images")
            .upload(`${folderName}/${file.name}`, file)

        if (uploadResponse.error) {
            return {
                isSuccess: false,
                message: "Uploading failed."
            } as FileResponseType;
        }

        const publicUrlResponse = supabase.storage.from("org_images").getPublicUrl(uploadResponse.data.path);

        return {
            isSuccess: true,
            message: "Uploading successful.",
            url: publicUrlResponse.data.publicUrl
        } as FileResponseType;

    } catch {
        return {
            isSuccess: false,
            message: "Uploading failed."
        } as FileResponseType;
    }
}

export async function deleteFile(filePath: string) {
    const { error } = await supabase
        .storage
        .from('org_images')
        .remove([filePath])

    if (error) {
        return { isSuccess: false, message: "Deleting failed." } as FileResponseType;
    }

    return { isSuccess: true, message: "Deleting successful." } as FileResponseType;

}