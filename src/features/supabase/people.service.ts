import { supabase } from "./supabaseConfig";

export type PersonProps = {
    id: string;
    name: string;
    image: string;
    position: string;
    roles: string[]; // Ensure roles are always an array
    biography: string;
    visibility: boolean;
    indexNumber: number;
};

type PersonSupabaseType = Omit<PersonProps, "roles"> & { roles: string }; // Supabase stores roles as a string

type ApiResponse<T> = {
    isSuccess: boolean;
    message: string;
    data: T | null;
};

/**
 * Converts Supabase data format to a JavaScript-friendly format.
 */
function toPerson(obj: PersonSupabaseType): PersonProps {
    return {
        ...obj,
        roles: obj.roles ? JSON.parse(obj.roles) : [], // Ensure roles is always an array
    };
}

/**
 * Retrieves all people from Supabase.
 */
export async function getPeople(): Promise<ApiResponse<PersonProps[]>> {
    const { data, error } = await supabase.from("people").select("*");

    return {
        isSuccess: !error,
        message: error?.message || "Retrieving successful.",
        data: data ? data.map(toPerson) : null,
    };
}

/**
 * Retrieves a single person by ID.
 */
export async function getPersonById(id: string): Promise<ApiResponse<PersonProps>> {
    const { data, error } = await supabase.from("people").select("*").eq("id", id).single();

    return {
        isSuccess: !error,
        message: error?.message || "Retrieving successful.",
        data: data ? toPerson(data) : null,
    };
}

/**
 * Creates a new person in Supabase.
 */
export async function createPerson(person: Omit<PersonProps, "id">): Promise<ApiResponse<PersonProps>> {
    const { data, error } = await supabase
        .from("people")
        .insert({
            ...person,
            roles: JSON.stringify(person.roles), // Ensure roles is stored as JSON
        })
        .select()
        .single();

    return {
        isSuccess: !error,
        message: error?.message || "Person created successfully.",
        data: data ? toPerson(data) : null,
    };
}

/**
 * Updates an existing person by ID (supports partial updates).
 */
export async function updatePerson(id: string, person: Partial<PersonProps>): Promise<ApiResponse<PersonProps>> {
    const { data, error } = await supabase
        .from("people")
        .update({
            ...person,
            roles: person.roles ? JSON.stringify(person.roles) : undefined, // Only stringify if updating roles
        })
        .eq("id", id)
        .select()
        .single();

    return {
        isSuccess: !error,
        message: error?.message || "Person updated successfully.",
        data: data ? toPerson(data) : null,
    };
}

/**
 * Deletes a person by ID.
 */
export async function deletePerson(id: string): Promise<ApiResponse<null>> {
    const { error } = await supabase.from("people").delete().eq("id", id);

    return {
        isSuccess: !error,
        message: error?.message || "Person deleted successfully.",
        data: null,
    };
}
