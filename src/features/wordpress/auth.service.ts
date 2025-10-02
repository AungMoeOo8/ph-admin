import { User } from "@/hooks/auth";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export async function login(username: string, password: string) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    throw new Error("Internal server error.")
  }

  const data: User = await res.json()
  return data;
}

export async function logout() {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/auth/logout`,
    {
      method: "POST",
    }
  );

  if (!res.ok) {
    throw new Error("Internal server error.")
  }

  const data = await res.json()

  return data;
}
