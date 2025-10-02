import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { Box, Button, createListCollection, Fieldset, Flex, Heading, Input, SelectContent, SelectItem, SelectRoot, SelectTrigger, SelectValueText } from "@chakra-ui/react";
import { useMemo, useState } from "react";
import { Control, Controller, SubmitHandler, useController, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import { toaster } from "@/components/ui/toaster";
import { CourseSchema } from "@/features/wordpress/course.service";
import { useCreateCourse } from "@/hooks/course";
import z from "zod";
import { useGetPersonsNames } from "@/hooks/people";

export function InstructorInput({ control }: { control: Control<z.infer<typeof CourseSchema>> }) {
  const { data: persons, isLoading } = useGetPersonsNames();

  const { field } = useController({ control, name: "instructorId" });

  // Build a collection that the Chakra collection select expects
  const collection = useMemo(() => {
    return createListCollection({
      items: (persons ?? []).map(person => ({
        label: person.name,
        value: person.id.toString(),
      }))
    });
  }, [persons]);

  const selectValue = useMemo(() => {
    return field.value ? [field.value.toString()] : [""]
  }, [field.value])

  if (isLoading) return <p>Loading...</p>;

  return (
    <SelectRoot
      collection={collection}
      value={selectValue}
      onSelect={(values) => field.onChange(values.value)}
    >
      <SelectTrigger>
        <SelectValueText placeholder="Select instructor" />
      </SelectTrigger>

      <SelectContent position="absolute" top="100%" w="100%">
        {collection.items.map((option) => (
          <SelectItem
            key={option.value}
            item={option}
          >
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </SelectRoot>
  );
}

export function OutlineInput({ control }: { control: Control<z.infer<typeof CourseSchema>> }) {

  const { field } = useController({ control: control, name: "outlines" })

  const [outlineInput, setOutlineInput] = useState("");

  const addOutline = () => {
    const outlines = field.value;
    if (outlineInput.trim() && !outlines.includes(outlineInput.trim())) {
      const updatedOutlines = [...outlines, outlineInput.trim()];
      field.onChange(updatedOutlines);
    }
    setOutlineInput("");
  };

  const removeOutline = (outline: string) => {
    const outlines = field.value.filter((o) => o !== outline);
    field.onChange(outlines);
  };

  return (
    <>
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
    </>
  )
}

export default function AddCoursePage() {
  const navigate = useNavigate();

  const { register, handleSubmit, control } =
    useForm<z.infer<typeof CourseSchema>>({
      defaultValues: {
        outlines: [],
      },
    });

  const createCourseMutation = useCreateCourse();

  const handleSaveBtn: SubmitHandler<z.infer<typeof CourseSchema>> = async (course) => {
    await createCourseMutation.mutateAsync(course, {
      onSuccess: () => {
        toaster.create({
          type: "success",
          description: "Course saved.",
        });
        navigate("/dashboard/courses", { replace: true });
      },
      onError: (error) => {
        toaster.create({
          type: "error",
          description: error.message,
        });
      },
    });
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

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
