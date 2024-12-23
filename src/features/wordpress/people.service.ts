type PersonProps = {
    id: string;
    name: string;
    image: string;
    position: string;
    roles: string[];
    biography: string;
    visibility: boolean;
}

export async function getPeople() {
    const res = await fetch("")
    const data = await res.json() as PersonProps[];

    return data
}

export async function createPerson(person: PersonProps) {
    const res = await fetch(" ", { method: "POST", body: JSON.stringify(person) })
    const data = await res.json() as PersonProps;

    return data;
}

export async function updatePerson(id: string, person: PersonProps) {
    const res = await fetch(" ", { method: "PATCH", body: JSON.stringify(person) })
    const data = await res.json() as PersonProps;

    return data;
}

export async function deletePerson(id: string) {
    const res = await fetch(`${id}`, { method: "DELETE" })
    const data = await res.json() as PersonProps;

    return data;
}