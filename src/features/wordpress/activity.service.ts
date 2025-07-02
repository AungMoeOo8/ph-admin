import { Response } from "../../types";

const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type ActivityProps = {
  id: string;
  imageUrl: string;
  visibility: boolean;
  indexNumber: number;
};

export async function getActivities() {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity`
  );
  const data: Response<ActivityProps[]> = await res.json();

  return data;
}

export async function getActivityById(id: string) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/${id}`
  );
  const data: Response<ActivityProps> = await res.json();

  return data;
}

export async function createActivity(service: ActivityProps) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity`,
    {
      method: "POST",
      body: JSON.stringify(service),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data: Response<ActivityProps> = await res.json();

  return data;
}

export async function updateActivity(id: string, service: ActivityProps) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(service),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data: Response<ActivityProps> = await res.json();

  return data;
}

export async function deleteActivity(id: string) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/${id}`,
    { method: "DELETE" }
  );
  const data: Response<ActivityProps> = await res.json();

  return data;
}

export async function reorderActivity(people: ActivityProps[]) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/activity/reorder`,
    {
      method: "POST",
      body: JSON.stringify(people),
      headers: { "Content-Type": "application/json" },
    }
  );

  const data: Response<ActivityProps[]> = await res.json();

  return data;
}
