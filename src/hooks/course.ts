import {
  CourseSchema,
  createCourse,
  deleteCourse,
  getCourseById,
  getCourses,
  updateCourse,
} from "@/features/wordpress/course.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import z from "zod";

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
export function useUpdateCourse(courseId: number) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (course: z.infer<typeof CourseSchema>) => updateCourse(courseId, course),
    onSuccess: () => {
      qc.invalidateQueries({queryKey: ["courses", courseId]})
    }
  });
}

export function useDeleteCourse() {
  return useMutation({
    mutationFn: deleteCourse
  });
}
