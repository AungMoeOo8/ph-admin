import { toaster } from "@/components/ui/toaster";
import {
  deleteService,
  getServices,
  ServiceProps,
} from "@/features/wordpress/service.service";
import {
  Badge,
  Button,
  Flex,
  IconButton,
  Stack,
  Table,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function ServicePage() {
  const [serviceList, setServiceList] = useState<ServiceProps[]>([]);

  useEffect(() => {
    (async () => {
      const services = await getServices();
      setServiceList(services.data);
    })();
  }, []);

  const handleDeleteServiceBtn = async (id: string) => {
    const response = await deleteService(id);
    toaster.create({
      type: response.isSuccess ? "success" : "error",
      description: response.isSuccess
        ? "Deleting successful."
        : "Deleting failed.",
    });

    if (response.isSuccess) {
      setServiceList(serviceList.filter((service) => service.id != id));
    }
  };

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/admin/service/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      <Table.Root size={"lg"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>No.</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Provider</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {serviceList.map((service, index) => (
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
                  <Link to={`/admin/service/${service.id}/edit`}>
                    <LuPencil />
                  </Link>
                </IconButton>
                <IconButton
                  colorPalette={"red"}
                  onClick={async () => await handleDeleteServiceBtn(service.id)}
                >
                  <LuTrash />
                </IconButton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
