// import { validateToken } from "@/util";
import { fetchFactory } from "@/fetchFactory";
import z from "zod";

const { VITE_WORDPRESS_DOMAIN, VITE_PH_DOMAIN } = import.meta.env;

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

export const PersonSchema = z.object({
  name: z.string(),
  position: z.string(),
  roles: z.string().array(),
  image: z.instanceof(File).optional(),
  biography: z.string(),
  visibility: z.boolean().default(false),
  indexNumber: z.number().default(0)
})

const ServerError = "Internal Server Error"
const NotFoundError = "Data not found."

export async function getPersons() {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons`);

  if (!res.ok) {
    if (res.status === 404) throw new Error(NotFoundError);
    throw new Error(ServerError)
  }

  const data: PersonProps[] = await res.json();

  return data
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

export async function createPerson(person: z.infer<typeof PersonSchema>) {
  const formData = new FormData()
  formData.append("name", person.name)
  formData.append("position", person.position)
  formData.append("roles", JSON.stringify(person.roles))
  if (person.image) formData.append("image", person.image)
  formData.append("biography", person.biography)
  formData.append("visibility", person.visibility ? "1" : "0")

  const res = await fetchFactory.createFetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) throw new Error(ServerError);

  const data: { id: number } = await res.json();

  return data;
}

export async function updatePerson(personId: number, person: z.infer<typeof PersonSchema>) {
  const formData = new FormData()
  formData.append("name", person.name)
  formData.append("position", person.position)
  formData.append("roles", JSON.stringify(person.roles))
  if (person.image) formData.append("image", person.image)
  formData.append("biography", person.biography)
  formData.append("visibility", person.visibility ? "1" : "0")

  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/${personId}`,
    {
      method: "POST",
      body: formData,
    }
  );

  if (!res.ok) throw new Error(ServerError);

  const data: PersonProps = await res.json();

  return data;
}

export async function deletePerson(id: number) {
  const res = await fetchFactory.createFetch(
    `${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/${id}`,
    { method: "DELETE" }
  );

  if (!res.ok) throw new Error(ServerError);

  const data: PersonProps = await res.json();

  return data;
}

export async function getPersonsNames() {
  const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/wp-json/api/persons/names`);

  if (!res.ok) {
    if (res.status === 404) throw new Error(NotFoundError);
    throw new Error(ServerError)
  }

  const data: Pick<PersonProps, "id" | "name">[] = await res.json();

  return data
}

export async function reorderPersons(people: PersonProps[]) {
  const res = await fetchFactory.createFetch(
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

export async function invalidateProfessionals() {
  const res = await fetch(`${VITE_PH_DOMAIN}/professionals`)

  if (!res.ok) throw new Error(ServerError);
}

export async function invalidateMembers() {
  const res = await fetch(`${VITE_PH_DOMAIN}/members`)

  if (!res.ok) throw new Error(ServerError);
}