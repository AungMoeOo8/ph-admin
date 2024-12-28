import { toaster } from "@/components/ui/toaster";
import {
  deletePerson,
  getPeople,
  PersonProps,
} from "@/features/wordpress/people.service";
import {
  Badge,
  Button,
  Flex,
  IconButton,
  Stack,
  Table,
  Text,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function PeoplePage() {
  const [peopleList, setPeopleList] = useState<PersonProps[]>([]);

  useEffect(() => {
    (async () => {
      const response = await getPeople();
      const people = response.data;
      setPeopleList(people);
    })();
  }, []);

  async function handleDeleteBtn(id: string) {
    await deletePerson(id);
    toaster.create({
      type: "success",
      description: "Deleting successful.",
    });
  }

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/admin/people/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      <Table.Root size={"lg"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>No.</Table.ColumnHeader>
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Position</Table.ColumnHeader>
            <Table.ColumnHeader>Roles</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {peopleList.map((person, index) => (
            <Table.Row key={person.id}>
              <Table.Cell>{index + 1}</Table.Cell>

              <Table.Cell>{person.name}</Table.Cell>

              <Table.Cell>
                {person.position == "PROFESSIONAL" ? "Professional" : "Member"}
              </Table.Cell>

              <Table.Cell>
                <Flex gapX={2} fontSize={"sm"} w="fit-content">
                  {person.roles.slice(0, 2).map((role) => (
                    <Text display={"inline"}>{role}</Text>
                  ))}
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

              <Table.Cell display={"flex"} justifyContent={"center"} gapX={2}>
                <IconButton asChild colorPalette={"cyan"}>
                  <Link to={`/admin/people/${person.id}/edit`}>
                    <LuPencil />
                  </Link>
                </IconButton>
                <IconButton
                  colorPalette={"red"}
                  onClick={async () => await handleDeleteBtn(person.id)}
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
