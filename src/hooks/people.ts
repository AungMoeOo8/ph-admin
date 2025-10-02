import {
  createPerson,
  deletePerson,
  getPersonById,
  getPersons,
  getPersonsNames,
  PersonSchema,
  updatePerson,
} from "@/features/wordpress/people.service";
import { useMutation, useQuery } from "@tanstack/react-query";
import z from "zod";

export function useGetAllPersons() {
  return useQuery({
    queryKey: ["persons"],
    queryFn: getPersons,
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  });
}

export function useGetPersonById(personId: number) {
  return useQuery({
    queryKey: [`persons`, personId],
    queryFn: async () => getPersonById(personId),
    // refetchOnWindowFocus: false,
    // refetchOnReconnect: false,
  });
}

export function useCreatePerson() {
  return useMutation({
    mutationFn: createPerson
  })
}

export function useUpdatePerson(personId: number) {
  // const qc = useQueryClient()
  return useMutation({
    mutationFn: (props: z.infer<typeof PersonSchema>) => updatePerson(personId, props)
    // onSuccess: (person) => {
    //   qc.invalidateQueries({ queryKey: ["persons", person.id] })
    // }
  });
}

export function useDeletePerson() {
  return useMutation({
    mutationFn: deletePerson
  });
}

export function useGetPersonsNames() {
  return useQuery({
    queryKey: ["personsNames"],
    queryFn: getPersonsNames
  })
}