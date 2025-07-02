import {
  createPerson,
  deletePerson,
  getPeople,
  PersonProps,
  updatePerson,
} from "@/features/wordpress/people.service";
import { useOnceQuery } from "./useOnceQuery";
import { useMutation } from "@tanstack/react-query";

export function usePeopleQuery() {
  return useOnceQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const response = await getPeople();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data.sort((a, b) =>
        a.indexNumber > b.indexNumber ? 0 : -1
      );
    },
    initialData: null,
  });
}

export function useCreatePerson() {
  return useMutation({
    mutationFn: async (person: PersonProps) => {
      const response = await createPerson(person);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}

export function useUpdatePerson() {
  return useMutation({
    mutationFn: async (person: PersonProps) => {
      const response = await updatePerson(person.id, person);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}

export function useDeletePerson() {
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await deletePerson(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });
}
