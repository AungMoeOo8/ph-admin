import {
  createPerson,
  deletePerson,
  getPersonById,
  getPersons,
  updatePerson,
} from "@/features/wordpress/people.service";
import { useMutation, useQuery } from "@tanstack/react-query";

export function useGetAllPersons() {
  return useQuery({
    queryKey: ["persons"],
    queryFn: getPersons,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useGetPersonById(personId: number) {
  return useQuery({
    queryKey: [`persons`, personId],
    queryFn: async () => getPersonById(personId),
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}

export function useCreatePerson() {
  return useMutation({
    mutationFn: createPerson
  })
}

export function useUpdatePerson() {
  // const qc = useQueryClient()
  return useMutation({
    mutationFn: updatePerson,
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
