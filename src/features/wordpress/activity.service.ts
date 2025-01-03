const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export type ActivityProps = {
    id: string,
    url: string,
    visibility: boolean,
    indexNumber: number,
}

export async function getActivities() {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: ActivityProps[] };

    return data
}

export async function getActivityById(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/${id}`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: ActivityProps };

    return data
}

export async function createActivity(service: ActivityProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity`, {
        method: "POST",
        body: JSON.stringify(service),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: ActivityProps };

    return data;
}

export async function updateActivity(id: string, service: ActivityProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/${id}`, {
        method: "PATCH",
        body: JSON.stringify(service),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: ActivityProps };

    return data;
}

export async function deleteActivity(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/${id}`, { method: "DELETE" })
    const data = await res.json() as { isSuccess: boolean, message: string, data: ActivityProps };

    return data;
}