const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export type AuthProps = {
    id: string,
    email: string,
    name: string
}

export async function login(email: string, password: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/auth/login`, {
        method: "POST",
        body: JSON.stringify({ email, password })
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: AuthProps };

    return data
}

export async function logout() {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/auth/logout`, {
        method: "POST"
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: AuthProps };

    return data
}