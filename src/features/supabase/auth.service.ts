import { supabase } from "./supabaseConfig";

// Login service using email and password
export async function login(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        return { isSuccess: false, message: error.message };
    }

    return {
        isSuccess: true,
        message: "Login successful",
        user: data.user,
    };
}

// Logout service
export async function logout() {
    const { error } = await supabase.auth.signOut();

    if (error) {
        return { isSuccess: false, message: error.message };
    }

    return { isSuccess: true, message: "Logout successful" };
}
