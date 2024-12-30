import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CloseButton } from "@/components/ui/close-button";
import { Field } from "@/components/ui/field";
import {
  FileInput,
  FileUploadClearTrigger,
  FileUploadRoot,
} from "@/components/ui/file-upload";
import { InputGroup } from "@/components/ui/input-group";
import { Tag } from "@/components/ui/tag";
import {
  getPersonById,
  PersonProps,
  updatePerson,
} from "@/features/wordpress/people.service";

import {
  Box,
  createListCollection,
  Fieldset,
  Flex,
  For,
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
import { useEffect, useMemo, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { LuFileUp } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";

const positons = createListCollection({
  items: [
    { label: "Professional", value: "PROFESSIONAL" },
    { label: "Member", value: "MEMBER" },
  ],
});

export default function EditPeoplePage() {
  const { personId } = useParams();
  const navigate = useNavigate();

  const { register, handleSubmit, control, watch, getValues, setValue } =
    useForm<PersonProps>({
      values: {
        id: "",
        name: "",
        position: "",
        roles: [],
        image: "",
        biography: "",
        visibility: false,
        indexNumber: 0,
      } as PersonProps,
    });

  const [inputValue, setInputValue] = useState("");
  const [uploadImage, setUploadImage] = useState<File[]>([]);

  useEffect(() => {
    (async () => {
      const response = await getPersonById(personId!);
      const person = response.data;
      setValue("id", person.id);
      setValue("name", person.name);
      setValue("position", person.position);
      setValue("roles", person.roles ? person.roles : []);
      setValue("image", person.image);
      setValue("biography", person.biography);
      setValue("visibility", person.visibility);
    })();
  }, []);

  const savePerson: SubmitHandler<PersonProps> = async (person) => {
    await updatePerson(person.id, person);
    navigate("/admin/people", { replace: true });
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

  const previewImage = useMemo(() => {
    if (uploadImage.length > 0) {
      return URL.createObjectURL(uploadImage![0]);
    }
    return watch("image");
  }, [uploadImage, watch("image")]);

  return (
    <Box>
      <Fieldset.Root>
        <Heading size="2xl">Edit person</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Name">
              <Input {...register("name")} />
            </Field>

            <Field label="Position">
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
                          defaultChecked
                        >
                          {postion.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </SelectRoot>
                )}
              />
            </Field>

            <Field label="Roles">
              <Controller
                name="roles"
                control={control}
                render={({ field }) => (
                  <Box>
                    <For each={field.value}>
                      {(role, index) => (
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
                      )}
                    </For>
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
              src={previewImage}
              objectFit={"contain"}
              aspectRatio={"golden"}
            />
            <FileUploadRoot
              onFileChange={(e) => {
                if (e.acceptedFiles.length > 0)
                  return setUploadImage(e.acceptedFiles);

                return setUploadImage([]);
              }}
            >
              <InputGroup
                w="full"
                startElement={<LuFileUp />}
                endElement={
                  <FileUploadClearTrigger asChild>
                    <CloseButton
                      me="-1"
                      size="xs"
                      variant="plain"
                      focusVisibleRing="inside"
                      focusRingWidth="2px"
                      pointerEvents="auto"
                      color="fg.subtle"
                    />
                  </FileUploadClearTrigger>
                }
              >
                <FileInput />
              </InputGroup>
            </FileUploadRoot>
          </Fieldset.Content>
        </Flex>

        <Field label="Biography">
          <Textarea rows={5} {...register("biography")} />
        </Field>

        <Button onClick={handleSubmit(savePerson)}>Save changes</Button>
      </Fieldset.Root>
    </Box>
  );
}
