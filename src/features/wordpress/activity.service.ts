const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type ActivityProps = {
  id: number;
  mediaId: number;
  imageUrl: string;
  visibility: boolean;
  indexNumber: number;
};

export async function getActivities() {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/activities`
  );
  const data: ActivityProps[] = await res.json();

  return data.sort((a, b) =>
    a.indexNumber > b.indexNumber ? 0 : -1
  ).map((item, index) => ({ ...item, indexNumber: index }));
}

export async function getActivityById(id: number) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/activities/${id}`
  );
  const data: ActivityProps = await res.json();

  return data;
}

export async function createActivity(activity: ActivityProps, file: File) {

  const formData = new FormData();
  formData.append("image", file); // 👈 File object from <input type="file">
  formData.append("visibility", activity.visibility ? "true" : "false");
  formData.append("indexNumber", activity.indexNumber.toString());

  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/activities`,
    {
      method: "POST",
      body: formData,
      // headers: { "Content-Type": "application/json" },
    }
  );
  const data: ActivityProps = await res.json();

  return data;
}

export async function updateActivity(id: string, service: ActivityProps) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/activity/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(service),
      headers: { "Content-Type": "application/json" },
    }
  );
  const data: ActivityProps = await res.json();

  return data;
}

export async function deleteActivity(id: number) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/activities/${id}`,
    { method: "DELETE" }
  );
  const data: ActivityProps = await res.json();

  return data;
}

export async function reorderActivity(activities: ActivityProps[]) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/activities/reorder`,
    {
      method: "POST",
      body: JSON.stringify(activities),
      headers: { "Content-Type": "application/json" },
    }
  );

  const data: ActivityProps[] = await res.json();

  return data;
}
