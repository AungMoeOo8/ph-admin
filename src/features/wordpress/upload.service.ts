const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export async function uploadFile(file: File) {
    const body = new FormData();
    body.append("image", file)
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/upload`, { method: "POST", body: body })
    const data = await res.json() as { isSuccess: boolean, message: string, url: string };

    return data;
}