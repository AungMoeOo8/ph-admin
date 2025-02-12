import { supabase } from "./supabaseConfig";

export type CourseProps = {
    id: string;
    title: string;
    duration: string;
    instructor: string;
    guestLecturer: string;
    outlines: string[];
    visibility: boolean;
    indexNumber: number;
};

type CourseSupabaseType = Omit<CourseProps, "outlines"> & { outlines: string };

type ApiResponse<T> = {
    isSuccess: boolean;
    message: string;
    data: T | null;
};

function toCourse(obj: CourseSupabaseType): CourseProps {
    return {
        ...obj,
        outlines: obj.outlines ? JSON.parse(obj.outlines) : [], // Ensure outlines is always an array
    };
}

export async function getCourses(): Promise<ApiResponse<CourseProps[]>> {
    const { data, error } = await supabase.from("courses").select("*");

    return {
        isSuccess: !error,
        message: error?.message || "Retrieving successful.",
        data: data ? data.map(toCourse) : null,
    };
}

export async function getCourseById(id: string): Promise<ApiResponse<CourseProps>> {
    const { data, error } = await supabase.from("courses").select("*").eq("id", id).single();

    return {
        isSuccess: !error,
        message: error?.message || "Retrieving successful.",
        data: data ? toCourse(data) : null,
    };
}

export async function createCourse(course: Omit<CourseProps, "id">): Promise<ApiResponse<CourseProps>> {
    const { data, error } = await supabase
        .from("courses")
        .insert({
            ...course,
            outlines: JSON.stringify(course.outlines), // Store outlines as JSON
        })
        .select()
        .single();

    return {
        isSuccess: !error,
        message: error?.message || "Course created successfully.",
        data: data ? toCourse(data) : null,
    };
}

export async function updateCourse(id: string, course: Partial<CourseProps>): Promise<ApiResponse<CourseProps>> {
    const { data, error } = await supabase
        .from("courses")
        .update({
            ...course,
            outlines: course.outlines ? JSON.stringify(course.outlines) : undefined, // Only stringify if updating outlines
        })
        .eq("id", id)
        .select()
        .single();

    return {
        isSuccess: !error,
        message: error?.message || "Course updated successfully.",
        data: data ? toCourse(data) : null,
    };
}

export async function deleteCourse(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase.from("courses").delete().eq("id", id);

    return {
        isSuccess: !error,
        message: error?.message || "Course deleted successfully.",
        data: null,
    };
}
