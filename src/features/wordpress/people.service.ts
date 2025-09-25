const { VITE_WORDPRESS_DOMAIN } = import.meta.env;

export type PersonProps = {
  id: number;
  name: string;
  image: string;
  position: string;
  roles: string[];
  biography: string;
  visibility: boolean;
  indexNumber: number;
};

const ServerError = "Internal Server Error"
const NotFoundError = "Data not found."

export async function getPersons() {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons`);

  if (!res.ok) {
    if (res.status === 404) throw new Error(NotFoundError);
    throw new Error(ServerError)
  }

  const data: PersonProps[] = await res.json();

  return data.sort((a, b) =>
    a.indexNumber > b.indexNumber ? 0 : -1
  );
}

export async function getPersonById(id: number) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/${id}`
  );

  if (!res.ok) {
    if (res.status === 404) throw new Error(NotFoundError);
    throw new Error(ServerError)
  }

  const data: PersonProps = await res.json();

  return data;
}

export async function createPerson(person: PersonProps) {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons`, {
    method: "POST",
    body: JSON.stringify(person),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) throw new Error(ServerError);

  const data: { id: number } = await res.json();

  return data;
}

export async function updatePerson(person: PersonProps) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/${person.id}`,
    {
      method: "PUT",
      body: JSON.stringify(person),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error(ServerError);

  const data: PersonProps = await res.json();

  return data;
}

export async function deletePerson(id: number) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error(ServerError);

  const data: PersonProps = await res.json();

  return data;
}

export async function reorderPersons(people: PersonProps[]) {
  const res = await fetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/reorder`,
    {
      method: "POST",
      body: JSON.stringify(people),
      headers: { "Content-Type": "application/json" },
    }
  );

  if (!res.ok) throw new Error(ServerError);

  const data: PersonProps[] = await res.json();

  return data;
}
