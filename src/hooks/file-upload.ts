import { uploadFile } from "@/features/wordpress/upload.service";
import { useMutation } from "@tanstack/react-query";

export function useFileUpload(directory: string) {
  return useMutation({
    mutationFn: async (file: File) => {
      const response = await uploadFile(directory, file);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}
