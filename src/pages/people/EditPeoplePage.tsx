import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { PersonProps } from "@/features/firebase/people/peopleProps";
import { getPersonById } from "@/features/firebase/people/peopleService";

import {
  Box,
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
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useParams } from "react-router";

const positons = createListCollection({
  items: [
    { label: "Professional", value: "professional" },
    { label: "Member", value: "member" },
  ],
});

export default function EditPeoplePage() {
  const { personId } = useParams();

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
      } as PersonProps,
    });

    const [inputValue, setInputValue] = useState("");

  useEffect(() => {
    (async () => {
      const person = await getPersonById(personId!);
      setValue("id", person.id);
      setValue("name", person.name);
      setValue("position", person.position);
      setValue("roles", person.roles);
      setValue("image", person.image);
      setValue("biography", person.biography);
      setValue("visibility", person.visibility);
    })();
  }, []);

  const savePerson: SubmitHandler<PersonProps> = (data) => {
    console.log(data);
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
                    onValueChange={({ value }) => field.onChange(value)}
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
              src={watch("image")}
              objectFit={"contain"}
              aspectRatio={"golden"}
            />
            <Field label="Image Url">
              <Input
                placeholder="https://example.com/images/image.jpg"
                {...register("image")}
              />
            </Field>
          </Fieldset.Content>
        </Flex>

        <Field label="Biography">
          <Textarea rows={5} {...register("biography")} />
        </Field>

        <Button onClick={handleSubmit(savePerson)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
