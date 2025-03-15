const { VITE_WORDPRESS_DOMAIN } = import.meta.env

export type PersonProps = {
    id: string;
    name: string;
    image: string;
    position: string;
    roles: string[];
    biography: string;
    visibility: boolean;
    indexNumber: number;
}

export async function getPeople() {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/people`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: PersonProps[] };
    return data
}

export async function getPersonById(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/people/${id}`)
    const data = await res.json() as { isSuccess: boolean, message: string, data: PersonProps };

    return data
}

export async function createPerson(person: PersonProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/people`, {
        method: "POST",
        body: JSON.stringify(person),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: PersonProps };

    return data;
}

export async function updatePerson(id: string, person: PersonProps) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/people/${id}`, {
        method: "PATCH",
        body: JSON.stringify(person),
        headers: { "Content-Type": "application/json" }
    })
    const data = await res.json() as { isSuccess: boolean, message: string, data: PersonProps };

    return data;
}

export async function deletePerson(id: string) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/people/${id}`, { method: "DELETE" })
    const data = await res.json() as { isSuccess: boolean, message: string, data: PersonProps };

    return data;
}

export async function reorderPeople(people: PersonProps[]) {
    const res = await fetch(`${VITE_WORDPRESS_DOMAIN}/phweb/wp-json/api/people/reorder`, {
        method: "POST",
        body: JSON.stringify(people),
        headers: { "Content-Type": "application/json" }
    })

    console.log({ reorder: await res.json() })
    const data = await res.json() as { isSuccess: boolean, message: string, data: PersonProps };

    return data;
}