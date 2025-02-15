import { supabase } from "./supabaseConfig";

export type ActivityProps = {
    id: string;
    imageUrl: string;
    visibility: boolean;
    indexNumber: number;
};

type ActivityResponse<T> = {
    isSuccess: boolean;
    message: string;
    data?: T;
};

// ✅ Get all activities
export async function getActivities(): Promise<ActivityResponse<ActivityProps[]>> {
    const { data, error } = await supabase.from("activities").select("*").returns<ActivityProps[]>();

    if (error) {
        return { isSuccess: false, message: "Failed to retrieve activities." };
    }

    return { isSuccess: true, message: "Activities retrieved successfully.", data: data! };
}

// ✅ Get an activity by ID
export async function getActivityById(id: string): Promise<ActivityResponse<ActivityProps>> {
    const { data, error } = await supabase.from("activities").select("*").eq("id", id).single<ActivityProps>();

    if (error) {
        return { isSuccess: false, message: "Failed to retrieve activity." };
    }

    return { isSuccess: true, message: "Activity retrieved successfully.", data: data };
}

// ✅ Create a new activity
export async function createActivity(activity: Omit<ActivityProps, "id">): Promise<ActivityResponse<ActivityProps>> {
    const { error } = await supabase.from("activities").insert(activity);

    if (error) {
        return { isSuccess: false, message: "Failed to create activity." };
    }

    return { isSuccess: true, message: "Activity created successfully." };
}

// ✅ Update an existing activity
export async function updateActivity(id: string, activity: Partial<ActivityProps>): Promise<ActivityResponse<ActivityProps>> {
    const { error } = await supabase.from("activities").update(activity).eq("id", id);

    if (error) {
        return { isSuccess: false, message: "Failed to update activity." };
    }

    return { isSuccess: true, message: "Activity updated successfully." };
}

// ✅ Delete an activity
export async function deleteActivity(id: string): Promise<ActivityResponse<null>> {
    const { error } = await supabase.from("activities").delete().eq("id", id);

    if (error) {
        return { isSuccess: false, message: "Failed to delete activity." };
    }

    return { isSuccess: true, message: "Activity deleted successfully." };
}
