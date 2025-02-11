import { supabase } from "./supabaseConfig";

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

type PersonSupabaseType = {
    id: string;
    name: string;
    image: string;
    position: string;
    roles: string;
    biography: string;
    visibility: boolean;
    indexNumber: number;
}

function toPerson(obj: PersonSupabaseType) {
    const roles = JSON.parse(obj?.roles) as string[];
    const person = { ...obj, roles: roles } as PersonProps;
    return person
}

export async function getPeople() {
    const { data, error } = await supabase.from("people").select("*").returns<PersonSupabaseType[]>()

    const response = data?.map(item => {
        const people = toPerson(item)
        return people
    })

    return {
        isSuccess: error == null,
        message: error == null ? "Retrieving successful." : "Retrieving failed.",
        data: response
    } as { isSuccess: boolean, message: string, data: PersonProps[] };
}

export async function getPersonById(id: string) {
    const { data, error } = await supabase.from("people").select("*").eq("id", id).limit(1).single<PersonSupabaseType>()

    const person = toPerson(data!)

    const response = {
        isSuccess: error == null,
        message: error == null ? "Retrieving successful." : "Retrieving failed.",
        data: person
    } as { isSuccess: boolean, message: string, data: PersonProps };

    console.log(response)

    return response
}

export async function createPerson(person: PersonProps) {
    const { data, error } = await supabase.from("people").insert(person).select().returns<PersonProps>();

    return {
        isSuccess: error == null,
        message: error == null ? "Saving successful." : "Saving failed.",
        data: data
    } as { isSuccess: boolean, message: string, data: PersonProps };
}

export async function updatePerson(id: string, person: PersonProps) {
    const { data, error } = await supabase.from("people").update(person).eq("id", id).returns<PersonProps>()

    return {
        isSuccess: error == null,
        message: error == null ? "Updating successful." : "Updating failed.",
        data: data
    } as { isSuccess: boolean, message: string, data: PersonProps };
}

export async function deletePerson(id: string) {
    const res = await supabase.from("people").delete().eq("id", id)

    return {
        isSuccess: res.status == 204,
        message: res.status == 204 ? "Deleting successful." : "Deleting failed.",
    } as { isSuccess: boolean, message: string, data: PersonProps };
}