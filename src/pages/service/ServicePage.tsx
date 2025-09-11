import { toaster } from "@/components/ui/toaster";
import { reorderServices } from "@/features/wordpress/service.service";
import { useDeleteService, useServicesQuery } from "@/hooks/service";
import useDelayedAction from "@/hooks/useDelayedAction";
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
import { useQueryClient } from "@tanstack/react-query";
import { Reorder } from "motion/react";
import { useRef } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function ServicePage() {
  const { data, isPending } = useServicesQuery();
  const isFirstRender = useRef(true);
  const qc = useQueryClient();

  useDelayedAction(async () => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const updatedData = data?.map((service, index) => {
      service.indexNumber = index;
      return service;
    });

    await reorderServices(updatedData!);

    toaster.create({
      title: "Saved",
      description: "Reordered",
      type: "success",
    });
  }, []);

  const deleteServiceMutation = useDeleteService();

  async function handleDeleteBtn(id: string) {

    await deleteServiceMutation.mutateAsync(id, {
      onSuccess: (_, id) => {
        toaster.create({
          type: "success",
          description: "Deleting successful.",
        });
        qc.setQueryData(["services"], () =>
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
          <Link to={"/dashboard/services/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      {data && (
        <Reorder.Group
          values={data}
          onReorder={(prev) => {
            qc.setQueryData(["services"], prev);
          }}
        >
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
                <Table.Row key={service.id} asChild>
                  <Reorder.Item key={index} value={service} as="tr">
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
                    <Table.Cell
                      display={"flex"}
                      justifyContent={"center"}
                      gapX={2}
                    >
                      <IconButton asChild colorPalette={"cyan"}>
                        <Link to={`/dashboard/services/${service.id}/edit`}>
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
