import { getActivities } from "@/features/wordpress/activity.service";
import { useOnceQuery } from "./useOnceQuery";

export function useActivitiesQuery() {
  return useOnceQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await getActivities();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data.sort((a, b) =>
        a.indexNumber > b.indexNumber ? 0 : -1
      );
    },
    initialData: [],
  });
}
