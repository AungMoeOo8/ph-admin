import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import {
  Box,
  Button,
  createListCollection,
  Fieldset,
  Flex,
  Heading,
  Image,
  Input,
  SelectContent,
  SelectItem,
  SelectRoot,
  SelectTrigger,
  SelectValueText,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { LuUpload } from "react-icons/lu";
import { toaster } from "@/components/ui/toaster";
import { useCreatePerson } from "@/hooks/people";
import { PersonSchema } from "@/features/wordpress/people.service";
import z from "zod"

const positons = createListCollection({
  items: [
    { label: "Professional", value: "PROFESSIONAL" },
    { label: "Member", value: "MEMBER" },
  ],
});

export default function AddPeoplePage() {
  const navigate = useNavigate();

  const { register, handleSubmit, control, getValues, setValue } =
    useForm<z.infer<typeof PersonSchema>>({
      defaultValues: {
        roles: []
      }
    });

  const [inputValue, setInputValue] = useState("");
  const [uploadImage, setUploadImage] = useState<File[]>([]);

  const createPersonMutation = useCreatePerson();

  const handleSaveBtn: SubmitHandler<z.infer<typeof PersonSchema>> = async (person) => {
    person.image = uploadImage[0]
    await createPersonMutation.mutateAsync(person, {
      onSuccess: () => {
        toaster.create({
          type: "success",
          description: "Person saved.",
        });
        navigate("/dashboard/people", { replace: true });
      },
      onError: (error) => {
        toaster.create({
          type: "error",
          description: error.message,
        });
        return;
      },
    });
  };

  const addRole = () => {
    const roles = getValues("roles");
    if (inputValue.trim() && !roles.includes(inputValue.trim())) {
      const updatedRoles = [...roles, inputValue.trim()];
      setValue("roles", updatedRoles);
    }
    setInputValue("");
  };

  const removeRole = (role: string) => {
    const roles = getValues("roles").filter((r) => r !== role);
    setValue("roles", roles);
  };

  return (
    <Box>
      <Fieldset.Root>
        <Heading size={"2xl"}>Create new person</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Name" required>
              <Input {...register("name")} />
            </Field>

            <Field label="Position" required>
              <Controller
                control={control}
                name="position"
                render={({ field }) => (
                  <SelectRoot
                    name={field.name}
                    value={[field.value]}
                    collection={positons}
                    onValueChange={({ value }) => field.onChange(value[0])}
                  >
                    <SelectTrigger>
                      <SelectValueText placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent>
                      {positons.items.map((postion) => (
                        <SelectItem
                          item={postion}
                          key={postion.value}
                        // defaultChecked
                        >
                          {postion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </Field>

            <Field label="Roles" required>
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Box>
                    {field.value.map((role, index) => (
                      <Tag
                        key={index}
                        size="lg"
                        colorScheme="blue"
                        borderRadius="full"
                        m={1}
                        closable
                        onClick={() => removeRole(role)}
                      >
                        {role}
                      </Tag>
                    ))}
                  </Box>
                )}
              />
              <Input
                id="role-input"
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addRole();
                  }
                }}
              />
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

          <Fieldset.Content marginTop={0}>
            <Image
              src={
                uploadImage.length <= 0
                  ? ""
                  : URL.createObjectURL(uploadImage![0])
              }
              objectFit={"contain"}
              aspectRatio={"golden"}
            />
            <FileUploadRoot onFileAccept={(e) => setUploadImage(e.files)}>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  <LuUpload /> Upload file
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>
          </Fieldset.Content>
        </Flex>

        <Field label="Biography" required>
          <Textarea rows={5} {...register("biography")} />
        </Field>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
