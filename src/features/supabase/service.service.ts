import { supabase } from "./supabaseConfig";

export type ServiceProps = {
    id: string;
    provider: string;
    name: string;
    description: string;
    fees: { type: string; amount: number; description: string }[];
    ending: string;
    visibility: boolean;
    indexNumber: number;
};

type ServiceSupabaseType = Omit<ServiceProps, "fees"> & { fees: string };

type ApiResponse<T> = {
    isSuccess: boolean;
    message: string;
    data?: T;
};

function toService(obj: ServiceSupabaseType): ServiceProps {
    return {
        ...obj,
        fees: obj.fees ? JSON.parse(obj.fees) : [], // Ensure fees is always an array
    };
}

export async function getServices(): Promise<ApiResponse<ServiceProps[]>> {
    const { data, error } = await supabase.from("services").select("*");

    return {
        isSuccess: !error,
        message: error?.message || "Retrieving successful.",
        data: data ? data.map(toService) : undefined,
    };
}

export async function getServiceById(id: string): Promise<ApiResponse<ServiceProps>> {
    const { data, error } = await supabase.from("services").select("*").eq("id", id).single();

    return {
        isSuccess: !error,
        message: error?.message || "Retrieving successful.",
        data: data ? toService(data) : undefined,
    };
}

export async function createService(service: Omit<ServiceProps, "id">): Promise<ApiResponse<ServiceProps>> {
    const { data, error } = await supabase
        .from("services")
        .insert({
            ...service,
            fees: JSON.stringify(service.fees), // Store fees as JSON
        })
        .select()
        .single();

    return {
        isSuccess: !error,
        message: error?.message || "Service created successfully.",
        data: data ? toService(data) : undefined,
    };
}

export async function updateService(id: string, service: Partial<ServiceProps>): Promise<ApiResponse<ServiceProps>> {
    const { data, error } = await supabase
        .from("services")
        .update({
            ...service,
            fees: service.fees ? JSON.stringify(service.fees) : undefined, // Only stringify if updating fees
        })
        .eq("id", id)
        .select()
        .single();

    return {
        isSuccess: !error,
        message: error?.message || "Service updated successfully.",
        data: data ? toService(data) : undefined,
    };
}

export async function deleteService(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase.from("services").delete().eq("id", id);

    return {
        isSuccess: !error,
        message: error?.message || "Service deleted successfully.",
        data: null,
    };
}
