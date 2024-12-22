import { ServiceProps } from "@/firebase/service/serviceProps";
import { getservices } from "@/firebase/service/serviceService";
import { Badge, Button, Flex, Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function ServicePage() {
  const [serviceList, setServiceList] = useState<ServiceProps[]>([]);

  useEffect(() => {
    (async () => {
      const services = await getservices();
      setServiceList(services);
    })();
  }, []);

  async function handleDeleteBtn(id: string) {

  }

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
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Provider</Table.ColumnHeader>
            <Table.ColumnHeader>Visibility</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {serviceList.map((service) => (
            <Table.Row key={service.id}>
              <Table.Cell>{service.name}</Table.Cell>
              <Table.Cell>
                {service.provider}
              </Table.Cell>
              <Table.Cell>
                <Badge
                  size={"lg"}
                  colorPalette={service.visibility ? "green" : "orange"}
                >
                  {service.visibility ? "Public" : "Private"}
                </Badge>
              </Table.Cell>
              <Table.Cell display={"flex"} justifyContent={"center"} gapX={2}>
                <Button asChild colorPalette={"gray"}>
                  <Link to={`/admin/people/${service.id}/edit`}>
                    <LuPencil />
                  </Link>
                </Button>
                <Button
                  colorPalette={"red"}
                  onClick={async () => await handleDeleteBtn("asdf")}
                >
                  <LuTrash />
                </Button>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Stack>
  );
}
