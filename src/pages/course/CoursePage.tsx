import { toaster } from "@/components/ui/toaster";
import { deleteCourse, getCourses } from "@/features/wordpress/course.service";
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

export default function CoursePage() {
  const { data, isPending } = useQuery({
    queryKey: ["courses"],
    queryFn: async () => {
      const response = await getCourses();
      if (!response.isSuccess) throw new Error(response.message);
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteCourse(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  async function handleDeleteBtn(id: string) {
    mutation.mutate(id, {
      onSuccess: (_, id) => {
        toaster.create({
          type: "success",
          description: "Deleting successful.",
        });
        queryClient.setQueryData(["courses"], () =>
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
          <Link to={"/dashboard/course/new"}>
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
              <Table.ColumnHeader>Title</Table.ColumnHeader>
              <Table.ColumnHeader>Instructor</Table.ColumnHeader>
              <Table.ColumnHeader>Status</Table.ColumnHeader>
              <Table.ColumnHeader></Table.ColumnHeader>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {data.map((course, index) => (
              <Table.Row key={course.id}>
                <Table.Cell>{index + 1}</Table.Cell>
                <Table.Cell>{course.title}</Table.Cell>
                <Table.Cell>{course.instructor}</Table.Cell>
                <Table.Cell>
                  <Badge
                    size={"lg"}
                    colorPalette={course.visibility ? "green" : "orange"}
                  >
                    {course.visibility ? "Public" : "Private"}
                  </Badge>
                </Table.Cell>
                <Table.Cell display={"flex"} justifyContent={"center"} gapX={2}>
                  <IconButton asChild colorPalette={"cyan"}>
                    <Link to={`/dashboard/course/${course.id}/edit`}>
                      <LuPencil />
                    </Link>
                  </IconButton>
                  <IconButton
                    colorPalette={"red"}
                    onClick={async () => await handleDeleteBtn(course.id)}
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
