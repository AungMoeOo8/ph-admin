import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Fieldset,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { createCourse, CourseProps } from "@/features/wordpress/course.service";

export default function AddCoursePage() {
  const navigate = useNavigate();

  const { register, handleSubmit, control, getValues, setValue } =
    useForm<CourseProps>({
      defaultValues: {
        id: "",
        title: "",
        duration: "",
        instructor: "",
        guestLecturer: "",
        outlines: [],
        visibility: false,
        indexNumber: 0,
      },
    });

  const [outlineInput, setOutlineInput] = useState("");

  const handleSaveBtn: SubmitHandler<CourseProps> = async (course) => {
    course.id = uuidv4();
    await createCourse(course);

    navigate("/admin/course", { replace: true });
  };

  const addOutline = () => {
    const outlines = getValues("outlines");
    if (outlineInput.trim() && !outlines.includes(outlineInput.trim())) {
      const updatedOutlines = [...outlines, outlineInput.trim()];
      setValue("outlines", updatedOutlines);
    }
    setOutlineInput("");
  };

  const removeOutline = (outline: string) => {
    const outlines = getValues("outlines").filter((o) => o !== outline);
    setValue("outlines", outlines);
  };

  return (
    <Box>
      <Fieldset.Root>
        <Heading size={"2xl"}>Create new course</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Title" required>
              <Input {...register("title")} />
            </Field>

            <Field label="Duration" required>
              <Input {...register("duration")} />
            </Field>

            <Field label="Instructor" required>
              <Input {...register("instructor")} />
            </Field>

            <Field label="Guest Lecturer">
              <Input {...register("guestLecturer")} />
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
          <Controller
            name="outlines"
            control={control}
            render={({ field }) => (
              <Box>
                {field.value.map((outline, index) => (
                  <Tag
                    key={index}
                    size="lg"
                    colorScheme="blue"
                    borderRadius="full"
                    m={1}
                    closable
                    onClick={() => removeOutline(outline)}
                  >
                    {outline}
                  </Tag>
                ))}
              </Box>
            )}
          />
          <Input
            id="outline-input"
            type="text"
            value={outlineInput}
            onChange={(e) => setOutlineInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addOutline();
              }
            }}
          />
        </Field>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
