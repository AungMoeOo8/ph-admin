const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export type ServiceProps = {
    id: string;
    provider: string;
    name: string;
    description: string;
    fees: { type: string, amount: number, description: string }[];
    ending: string;
    visibility: boolean;
    indexNumber: number;
}

export async function getServices() {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/service`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: ServiceProps[] };

    return data
}

export async function getServiceById(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/service/${id}`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: ServiceProps };

    return data
}

export async function createService(service: ServiceProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/service`, {
        method: "POST",
        body: JSON.stringify(service),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: ServiceProps };

    return data;
}

export async function updateService(id: string, service: ServiceProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/service/${id}`, {
        method: "PATCH",
        body: JSON.stringify(service),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: ServiceProps };

    return data;
}

export async function deleteService(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/service/${id}`, { method: "DELETE" })
    const data = await res.json() as { isSuccess: boolean, message: string, data: ServiceProps };

    return data;
}