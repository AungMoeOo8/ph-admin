import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Tag } from "@/components/ui/tag";
import { PersonProps } from "@/firebase/people/peopleProps";
import { savePerson } from "@/firebase/people/peopleService";
import {
  Box,
  Button,
  createListCollection,
  Fieldset,
  Flex,
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
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";

const positons = createListCollection({
  items: [
    { label: "Professional", value: "professional" },
    { label: "Member", value: "member" },
  ],
});

export default function AddPeoplePage() {
  // const [imageUrl, setImageUrl] = useState("https://png.pngtree.com/png-clipart/20210604/ourmid/pngtree-gray-male-avatar-png-image_3416112.jpg");

  const navigate = useNavigate();

  const { register, handleSubmit, watch, control, getValues, setValue } =
    useForm<PersonProps>({
      defaultValues: {
        id: "",
        name: "",
        position: "",
        roles: [],
        image: "",
        biography: "",
        status: false,
      },
    });

  const [inputValue, setInputValue] = useState("");

  const handleSaveBtn = async () => {
    const person = getValues();
    person.id = person.name.trim().toLowerCase();
    await savePerson(person);

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

  return (
    <Box>
      <Fieldset.Root>
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
                    onValueChange={({value}) => field.onChange(value[0])}
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
              name="status"
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

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
