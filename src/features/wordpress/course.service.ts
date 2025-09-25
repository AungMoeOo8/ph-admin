const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type CourseProps = {
  id: number;
  title: string;
  duration: string;
  instructor: string;
  guestLecturer: string;
  outlines: string[];
  visibility: boolean;
  indexNumber: number;
};

export async function getCourses() {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses`);

  if (!res.ok) {
    if (res.status === 404) throw new Error("Data not found.");
    throw new Error("Internal server error")
  }

  const data: CourseProps[] = await res.json();

  return data.sort((a, b) =>
    a.indexNumber > b.indexNumber ? 0 : -1
  );
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

export async function createCourse(course: CourseProps) {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses`, {
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

export async function updateCourse(course: CourseProps) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/courses/${course.id}`,
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
  const res = await fetch(
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
  const res = await fetch(
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
