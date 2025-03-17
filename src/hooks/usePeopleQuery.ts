import { getPeople } from "@/features/wordpress/people.service";
import { useOnceQuery } from "./useOnceQuery";

export function usePeopleQuery() {
    const { data, isPending } = useOnceQuery({
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

    return { data, isPending };
}