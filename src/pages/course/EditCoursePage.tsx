import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Box, Button, Fieldset, Flex, Heading, Input } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import {
  CourseProps,
  CourseSchema,
} from "@/features/wordpress/course.service";
import { useGetCourseById, useUpdateCourse } from "@/hooks/course";
import z from "zod";
import { InstructorInput, OutlineInput } from "./AddCoursePage";

function EditCourseForm(course: CourseProps) {
  const navigate = useNavigate();

  const { register, handleSubmit, control } =
    useForm<z.infer<typeof CourseSchema>>({
      defaultValues: course,
    });

  const updateCourseMutation = useUpdateCourse(course.id);

  const handleSaveBtn: SubmitHandler<z.infer<typeof CourseSchema>> = async (course) => {
    await updateCourseMutation.mutateAsync(course);
    navigate("/dashboard/courses", { replace: true });
  };

  return (
    <Box>
      <Fieldset.Root>
        <Heading size={"2xl"}>Edit Course</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Title" required>
              <Input {...register("title")} />
            </Field>

            <Field label="Duration" required>
              <Input {...register("duration")} />
            </Field>

            <Field label="Instructor" required>
              <InstructorInput control={control} />
            </Field>

            <Field label="Guest Lecturer">
              <Input {...register("guestLecturer")} />
            </Field>

            <Field label="Order No.">
              <NumberInputRoot>
                <NumberInputField {...register("indexNumber")} />
              </NumberInputRoot>
            </Field>

            <Controller
              control={control}
              name="visibility"
              render={({ field }) => (
                <Field>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={({ checked }) => field.onChange(checked)}
                  >
                    {field.value ? "Public" : "Private"}
                  </Checkbox>
                </Field>
              )}
            />
          </Fieldset.Content>
        </Flex>

        <Field label="Outlines">
          <OutlineInput control={control} />
        </Field>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save Changes</Button>
      </Fieldset.Root>
    </Box>
  );
}

export default function EditCoursePage() {
  const { courseId } = useParams();

  const { data: course, isLoading } = useGetCourseById(Number(courseId));

  return <Box>
    {isLoading && <div>Loading...</div>}
    {course && <EditCourseForm {...course} />}
  </Box>
}
