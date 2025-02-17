const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export async function uploadFile(directory: string, file: File) {
    const body = new FormData();
    body.append("file", file)
    body.append("directory", directory)
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/upload`, { method: "POST", body: body })
    const data = await res.json() as { isSuccess: boolean, message: string, url: string };

    return data;
}

export async function updateFile(filePath: string, directory: string, file: File) {
    const deleteResponse = await deleteFile(filePath);
    if(!deleteResponse.isSuccess) return deleteResponse

    return await uploadFile(directory, file);
}

export async function deleteFile(filePath: string) {
    filePath = filePath.slice(
        filePath.indexOf("uploads/") + 7
    );

    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/delete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ filePath })
    })
    const data = await res.json() as { isSuccess: boolean, message: string, url: string };

    return data;
}