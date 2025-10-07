import { fetchFactory } from "@/fetchFactory";
import z from "zod";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type CourseProps = {
  id: number;
  title: string;
  duration: string;
  instructorId: number;
  guestLecturer: string;
  outlines: string[];
  visibility: boolean;
  indexNumber: number;
};

export const CourseSchema = z.object({
  title: z.string(),
  duration: z.string(),
  instructorId: z.number(),
  guestLecturer: z.string().optional(),
  outlines: z.string().array(),
  visibility: z.boolean().default(false),
  indexNumber: z.number().default(0)
})

export async function getCourses() {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses`);

  if (!res.ok) {
    if (res.status === 404) throw new Error("Data not found.");
    throw new Error("Internal server error")
  }

  const data: CourseProps[] = await res.json();

  return data
}

export async function getCourseById(id: number) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses/${id}`
  );

  if (!res.ok) {
    if (res.status === 404) throw new Error("Data not found.");
    throw new Error("Internal server error")
  }

  const data: CourseProps = await res.json();

  return data;
}

export async function createCourse(course: z.infer<typeof CourseSchema>) {
  const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses`, {
    method: "POST",
    body: JSON.stringify(course),
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${getUserFromStorage()?.token}`,
    },
  });

  if (!res.ok) throw new Error("Internal server error");

  const data: { id: number } = await res.json();

  return data;
}

export async function updateCourse(courseId: number, course: z.infer<typeof CourseSchema>) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses/${courseId}`,
    {
      method: "PUT",
      body: JSON.stringify(course),
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Internal server error");

  const data: { id: number } = await res.json();

  return data;
}

export async function deleteCourse(id: number) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses/${id}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Internal server error");

  const data: { id: number } = await res.json();

  return data;
}

export async function reorderCourses(courses: CourseProps[]) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses/reorder`,
    {
      method: "POST",
      body: JSON.stringify(courses),
      headers: {
        "Content-Type": "application/json",
        // Authorization: `Bearer ${getToken()}`,
      },
    }
  );

  if (!res.ok) throw new Error("Internal server error");

  const data: CourseProps[] = await res.json();

  return data;
}
