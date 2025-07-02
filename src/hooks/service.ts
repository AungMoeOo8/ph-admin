import {
  createService,
  deleteService,
  getServices,
  ServiceProps,
  updateService,
} from "@/features/wordpress/service.service";
import { useOnceQuery } from "./useOnceQuery";
import { useMutation } from "@tanstack/react-query";

export function useServicesQuery() {
  return useOnceQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await getServices();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data.sort((a, b) =>
        a.indexNumber > b.indexNumber ? 0 : -1
      );
    },
    initialData: null,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: async (service: ServiceProps) => {
      const response = await createService(service);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}

export function useUpdateService() {
  return useMutation({
    mutationFn: async (service: ServiceProps) => {
      const response = await updateService(service.id, service);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteService(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}
