import { getServices } from "@/features/wordpress/service.service";
import { useOnceQuery } from "./useOnceQuery";

export function useServicesQuery() {
  const { data, isPending } = useOnceQuery({
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

  return { data, isPending };
}