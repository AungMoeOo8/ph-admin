import { toaster } from "@/components/ui/toaster";
import {
  deleteCourse,
  getCourses,
  CourseProps,
} from "@/features/wordpress/course.service";
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

export default function CoursePage() {
  const [courseList, setCourseList] = useState<CourseProps[]>([]);

  useEffect(() => {
    (async () => {
      const courses = await getCourses();
      setCourseList(courses.data);
    })();
  }, []);

  const handleDeleteCourseBtn = async (id: string) => {
    const response = await deleteCourse(id);
    toaster.create({
      type: response.isSuccess ? "success" : "error",
      description: response.isSuccess
        ? "Course deleted successfully."
        : "Failed to delete course.",
    });

    if (response.isSuccess) {
      setCourseList((prev) => prev.filter((course) => course.id !== id));
    }
  };

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/admin/course/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      <Table.Root size={"lg"}>
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeader>No.</Table.ColumnHeader>
            <Table.ColumnHeader>Title</Table.ColumnHeader>
            <Table.ColumnHeader>Instructor</Table.ColumnHeader>
            <Table.ColumnHeader>Status</Table.ColumnHeader>
            <Table.ColumnHeader textAlign={"center"}>
              Actions
            </Table.ColumnHeader>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {courseList.map((course, index) => (
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
                  <Link to={`/admin/course/${course.id}/edit`}>
                    <LuPencil />
                  </Link>
                </IconButton>
                <IconButton
                  colorPalette={"red"}
                  onClick={async () => await handleDeleteCourseBtn(course.id)}
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