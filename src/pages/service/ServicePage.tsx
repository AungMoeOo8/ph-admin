import { toaster } from "@/components/ui/toaster";
import {
  deleteService,
  getServices,
} from "@/features/wordpress/service.service";
import { queryClient } from "@/main";
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function ServicePage() {
  const { data, isPending } = useQuery({
    queryKey: ["services"],
    queryFn: async () => {
      const response = await getServices();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteService(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  async function handleDeleteBtn(id: string) {
    await mutation.mutateAsync(id, {
      onSuccess: (_, id) => {
        toaster.create({
          type: "success",
          description: "Deleting successful.",
        });
        queryClient.setQueryData(["services"], () =>
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
          <Link to={"/dashboard/service/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      {data != undefined && (
        <Table.Root size={"lg"}>
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeader>No.</Table.ColumnHeader>
              <Table.ColumnHeader>Name</Table.ColumnHeader>
              <Table.ColumnHeader>Provider</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((service, index) => (
              <Table.Row key={service.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{service.name}</Table.Cell>
                <Table.Cell>{service.provider}</Table.Cell>
                <Table.Cell>
                  <Badge
                    size={"lg"}
                    colorPalette={service.visibility ? "green" : "orange"}
                  >
                    {service.visibility ? "Public" : "Private"}
                  </Badge>
                </Table.Cell>
                <Table.Cell display={"flex"} justifyContent={"center"} gapX={2}>
                  <IconButton asChild colorPalette={"cyan"}>
                    <Link to={`/dashboard/service/${service.id}/edit`}>
                      <LuPencil />
                    </Link>
                  </IconButton>
                  <IconButton
                    colorPalette={"red"}
                    onClick={async () => await handleDeleteBtn(service.id)}
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
