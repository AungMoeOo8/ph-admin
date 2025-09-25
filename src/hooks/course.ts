import {
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "@/features/wordpress/course.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetAllCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: getCourses,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  });
}

export function useGetCourseById(courseId: number) {
  return useQuery({
    queryKey: ["courses", courseId],
    queryFn: async () => getCourseById(courseId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false
  })
}

export function useCreateCourse() {
  return useMutation({
    mutationFn: createCourse
  });
}
export function useUpdateCourse() {
  return useMutation({
    mutationFn: updateCourse
  });
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: deleteCourse
  });
}
