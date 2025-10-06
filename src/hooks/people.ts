import {
  createPerson,
  deletePerson,
  getPersonById,
  getPersons,
  getPersonsNames,
  PersonSchema,
  updatePerson,
} from "@/features/wordpress/people.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
  return useMutation({
    mutationFn: (props: z.infer<typeof PersonSchema>) => updatePerson(personId, props)
  });
}

export function useDeletePerson() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deletePerson,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["persons"] })
    }
  });
}

export function useGetPersonsNames() {
  return useQuery({
    queryKey: ["personsNames"],
    queryFn: getPersonsNames
  })
}