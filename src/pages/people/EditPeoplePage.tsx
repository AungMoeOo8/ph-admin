import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { PersonProps } from "@/firebase/people/peopleProps";
import { getPersonById } from "@/firebase/people/peopleService";

import {
  Box,
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
import { useEffect } from "react";
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

  const { register, handleSubmit, control, watch, setValue } =
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

  useEffect(() => {
    (async () => {
      const person = await getPersonById(personId!);
      setValue("id", person.id);
      setValue("name", person.name);
      setValue("position", person.position);
      setValue("image", person.image);
      setValue("biography", person.biography);
      setValue("visibility", person.visibility);
    })();
  }, []);

  const savePerson: SubmitHandler<PersonProps> = (data) => {
    console.log(data);
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
              <Input {...register("roles")} />
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
