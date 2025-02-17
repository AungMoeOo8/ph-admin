import { toaster } from "@/components/ui/toaster";
import { deletePerson, getPeople } from "@/features/wordpress/people.service";
import { deleteFile } from "@/features/wordpress/upload.service";
import { useOnceQuery } from "@/hooks/useOnceQuery";
import { queryClient } from "@/main";
import {
  Badge,
  Box,
  Button,
  Flex,
  For,
  IconButton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useMutation } from "@tanstack/react-query";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function PeoplePage() {
  const { data, isPending } = useOnceQuery({
    queryKey: ["people"],
    queryFn: async () => {
      const response = await getPeople();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    },
    initialData: null,
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const response = await deleteFile(filePath);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  const deletePersonMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deletePerson(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  async function handleDeleteBtn(id: string, filePath: string) {
    await deleteFileMutation.mutateAsync(filePath, {
      onError: () => {
        toaster.create({
          type: "error",
          description: "Deleting failed.",
        });
        return;
      },
    });

    await deletePersonMutation.mutateAsync(id, {
      onSuccess: (_, id) => {
        toaster.create({
          type: "success",
          description: "Deleting successful.",
        });
        queryClient.setQueryData(["people"], () =>
          data?.filter((x) => x.id !== id)
        );
      },
      onError: () => {
        toaster.create({
          type: "error",
          description: "Deleting failed.",
        });
      },
    });
  }

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/dashboard/people/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      {data != null && (
        <Table.Root size={"lg"}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>No.</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Position</Table.ColumnHeader>
              <Table.ColumnHeader>Roles</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data
              .sort((a, b) => (a.indexNumber > b.indexNumber ? 0 : -1))
              .map((person, index) => (
                <Table.Row key={person.id}>
                  <Table.Cell>{index + 1}</Table.Cell>

                  <Table.Cell>{person.name}</Table.Cell>

                  <Table.Cell>
                    {person.position == "PROFESSIONAL"
                      ? "Professional"
                      : "Member"}
                  </Table.Cell>

                  <Table.Cell>
                    <Flex gapX={2} fontSize={"sm"} w="fit-content">
                      <For each={person.roles}>
                        {(role, index) => (
                          <Text key={index} display={"inline"}>
                            {role},
                          </Text>
                        )}
                      </For>
                    </Flex>
                  </Table.Cell>

                  <Table.Cell>
                    <Badge
                      size={"lg"}
                      colorPalette={person.visibility ? "green" : "orange"}
                    >
                      {person.visibility ? "Public" : "Private"}
                    </Badge>
                  </Table.Cell>

                  <Table.Cell
                    display={"flex"}
                    justifyContent={"center"}
                    gapX={2}
                  >
                    <IconButton asChild colorPalette={"cyan"}>
                      <Link to={`/dashboard/people/${person.id}/edit`}>
                        <LuPencil />
                      </Link>
                    </IconButton>
                    <IconButton
                      colorPalette={"red"}
                      onClick={async () => {
                        await handleDeleteBtn(person.id, person.image);
                      }}
                    >
                      <LuTrash />
                    </IconButton>
                  </Table.Cell>
                </Table.Row>
              ))}
          </Table.Body>
        </Table.Root>
      )}
    </Stack>
  );
}
