const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export type CourseProps = {
    id: string,
    title: string,
    duration: string,
    instructor: string,
    guestLecturer: string,
    outlines: string[],
    visibility: boolean,
    indexNumber: number,
}

export async function getCourses() {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/course`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: CourseProps[] };

    return data
}

export async function getCourseById(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/course/${id}`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: CourseProps };

    return data
}

export async function createCourse(service: CourseProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/course`, {
        method: "POST",
        body: JSON.stringify(service),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: CourseProps };

    return data;
}

export async function updateCourse(id: string, service: CourseProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/course/${id}`, {
        method: "PATCH",
        body: JSON.stringify(service),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: CourseProps };

    return data;
}

export async function deleteCourse(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/course/${id}`, { method: "DELETE" })
    const data = await res.json() as { isSuccess: boolean, message: string, data: CourseProps };

    return data;
}

export async function reorderCourses(courses: CourseProps[]) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/course/reorder`, {
        method: "POST",
        body: JSON.stringify(courses),
        headers: { "Content-Type": "application/json" }
    })

    const data = await res.json() as { isSuccess: boolean, message: string, data: CourseProps };

    return data;
}