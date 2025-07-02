import {
  CourseProps,
  createCourse,
  deleteCourse,
  getCourses,
  updateCourse,
} from "@/features/wordpress/course.service";
import { useOnceQuery } from "./useOnceQuery";
import { useMutation } from "@tanstack/react-query";

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

export function useCreateCourse() {
  return useMutation({
    mutationFn: async (course: CourseProps) => {
      const response = await createCourse(course);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}
export function useUpdateCourse() {
  return useMutation({
    mutationFn: async (service: CourseProps) => {
      const response = await updateCourse(service.id, service);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCourse(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}
