import { toaster } from "@/components/ui/toaster";
import { reorderPeople } from "@/features/wordpress/people.service";
import { deleteFile } from "@/features/wordpress/upload.service";
import {
  Badge,
  Box,
  Button,
  Flex,
  IconButton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { Reorder } from "motion/react";
import useDelayedAction from "@/hooks/useDelayedAction";
import { useRef } from "react";
import { useDeletePerson, usePeopleQuery } from "@/hooks/people";

export default function PeoplePage() {
  const queryClient = useQueryClient();
  const isFirstRender = useRef(true);

  const { data, isPending } = usePeopleQuery();

  useDelayedAction(async () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const updatedData = data?.map((person, index) => {
      person.indexNumber = index;
      return person;
    });

    await reorderPeople(updatedData!);

    toaster.create({
      title: "Saved",
      description: "Reordered",
      type: "success",
    });
  }, []);

  const deleteFileMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const response = await deleteFile(filePath);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  const deletePersonMutation = useDeletePerson();

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
        <Reorder.Group
          values={data}
          onReorder={(prev) => {
            queryClient.setQueryData(["people"], prev);
          }}
        >
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
                // .sort((a, b) => (a.indexNumber > b.indexNumber ? 0 : -1))
                .map((person, index) => (
                  <Table.Row key={person.id} asChild>
                    <Reorder.Item key={person.id} value={person} as="tr">
                      <Table.Cell>{index + 1}</Table.Cell>

                      <Table.Cell>{person.name}</Table.Cell>

                      <Table.Cell>
                        {person.position == "PROFESSIONAL"
                          ? "Professional"
                          : "Member"}
                      </Table.Cell>

                      <Table.Cell>
                        <Flex gapX={2} fontSize={"sm"} w="fit-content">
                          {person.roles && person.roles[0]}
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
                    </Reorder.Item>
                  </Table.Row>
                ))}
            </Table.Body>
          </Table.Root>
        </Reorder.Group>
      )}
    </Stack>
  );
}
