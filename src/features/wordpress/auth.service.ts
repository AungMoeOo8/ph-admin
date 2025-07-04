const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type AuthProps = {
  id: number;
  email: string;
  name: string;
  token: string;
};

export async function login(username: string, password: string) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/auth/login`,
    {
      method: "POST",
      body: JSON.stringify({ username, password }),
    }
  );
  const data = (await res.json()) as {
    isSuccess: boolean;
    message: string;
    data: AuthProps;
  };

  return data;
}

export async function logout() {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/auth/logout`,
    {
      method: "POST",
    }
  );
  const data = (await res.json()) as {
    isSuccess: boolean;
    message: string;
    data: AuthProps;
  };

  return data;
}
