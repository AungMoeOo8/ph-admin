import { toaster } from "@/components/ui/toaster";
import { deletePerson, getPeople } from "@/firebase/peopleService";
import { PersonProps } from "@/types";
import { Badge, Button, Flex, Stack, Table } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function PeoplePage() {
  const [peopleList, setPeopleList] = useState<PersonProps[]>([]);

  useEffect(() => {
    (async () => {
      const people = await getPeople();
      setPeopleList(people);
    })();
    console.log("asdf");
  }, []);

  async function handleDeleteBtn(id: string) {
    const deletePromise = deletePerson(id);
    toaster.promise(deletePromise, {
      success: {
        title: "Successfully deleted",
        description: "Task done",
      },
      error: {
        title: "Deleting fail",
        description: "Something wrong with the deletion",
      },
      loading: { title: "Deleting...", description: "Please wait" },
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
            <Table.ColumnHeader>Name</Table.ColumnHeader>
            <Table.ColumnHeader>Position</Table.ColumnHeader>
            <Table.ColumnHeader>Visibility</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {peopleList.map((person) => (
            <Table.Row key={person.id}>
              <Table.Cell>{person.name}</Table.Cell>
              <Table.Cell>
                {person.position == "professional" ? "Professional" : "Member"}
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
                <Button asChild colorPalette={"gray"}>
                  <Link to={`/admin/people/${person.id}/edit`}>
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
