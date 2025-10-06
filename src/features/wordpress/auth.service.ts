import { fetchFactory } from "@/fetchFactory";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type Token = {
  accessToken: string;
  accessExpiry: number
}

export type User = {
  id: number;
  username: string;
  email: string;
  name: string;
}

export async function login(username: string, password: string) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      }
    }
  );

  if (!res.ok) {
    throw new Error("Internal server error.")
  }

  const data: User & Token = await res.json()
  return data;
}

export async function refreshAccessToken() {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/auth/refresh`,
    {
      method: "POST",
      credentials: "include"
    }
  );

  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) throw new Error("Token error")

    throw new Error("Internal server error.")
  }

  const data: Token = await res.json()
  return data;
}

export async function getLoginUser() {
  const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/auth/me`);

  if (!res.ok) {
    if (res.status >= 400 && res.status < 500) throw new Error("Token error")

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
      credentials: "include"
    }
  );

  if (!res.ok) {
    throw new Error("Internal server error.")
  }

  const data = await res.json()

  return data;
}
