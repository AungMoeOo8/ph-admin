const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export async function uploadFile(file: File) {
    const body = new FormData();
    body.append("image", file)
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/upload`, { method: "POST", body: body })
    const data = await res.json() as { isSuccess: boolean, message: string, url: string };

    return data;
}

export async function deleteFile(fileUrl: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: fileUrl })
    })
    const data = await res.json() as { isSuccess: boolean, message: string, url: string };

    return data;
}