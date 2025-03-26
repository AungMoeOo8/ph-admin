import { getCourses } from "@/features/wordpress/course.service";
import { useOnceQuery } from "./useOnceQuery";

export function useCoursesQuery() {
  return useOnceQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await getCourses();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data.sort((a, b) =>
        a.indexNumber > b.indexNumber ? 0 : -1
      );
    },
    initialData: null,
  });

}