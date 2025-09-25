import {
  createService,
  deleteService,
  getServiceById,
  getServices,
  updateService,
} from "@/features/wordpress/service.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetAllServices() {
  return useQuery({
    queryKey: ["services"],
    queryFn: getServices,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useGetServiceById(serviceId: number) {
  return useQuery({
    queryKey: [`services`, serviceId],
    queryFn: async () => getServiceById(serviceId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useCreateService() {
  return useMutation({
    mutationFn: createService
  });
}

export function useUpdateService() {
  // const qc = useQueryClient()
  return useMutation({
    mutationFn: updateService,
    // onSuccess: (service) => {
    //   qc.invalidateQueries({ queryKey: ["services", service.id] })
    // }
  });
}

export function useDeleteService() {
  return useMutation({
    mutationFn: deleteService
  });
}
