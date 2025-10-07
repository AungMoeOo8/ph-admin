import { fetchFactory } from "@/fetchFactory";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type ServiceProps = {
  id: number;
  provider: string;
  name: string;
  description: string;
  fees: { type: string; amount: number; description: string }[];
  ending: string;
  visibility: boolean;
  indexNumber: number;
};

export async function getServices() {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/services`);

  if (!res.ok) {
    if (res.status === 404) throw new Error("Data not found.");
    throw new Error("Internal server error")
  }

  const data: ServiceProps[] = await res.json();

  return data
}

export async function getServiceById(id: number) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/services/${id}`
  );

  if (!res.ok) {
    if (res.status === 404) throw new Error("Data not found.");
    throw new Error("Internal server error")
  }

  const data: ServiceProps = await res.json();

  return data;
}

export async function createService(service: ServiceProps) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/services`,
    {
      method: "POST",
      body: JSON.stringify(service),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Internal server error");

  const data: ServiceProps = await res.json();

  return data;
}

export async function updateService(service: ServiceProps) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/services/${service.id}`,
    {
      method: "PUT",
      body: JSON.stringify(service),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Internal server error");

  const data: ServiceProps = await res.json();

  return data;
}

export async function deleteService(id: number) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/services/${id}`,
    { method: "DELETE" }
  );
  const data: ServiceProps = await res.json();

  return data;
}

export async function reorderServices(services: ServiceProps[]) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/services/reorder`,
    {
      method: "POST",
      body: JSON.stringify(services),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error("Internal server error");

  const data: ServiceProps[] = await res.json();

  return data;
}
