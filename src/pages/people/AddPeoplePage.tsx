import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { Switch } from "@/components/ui/switch";
import { PersonProps } from "@/types";
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
import { Controller, useForm } from "react-hook-form";

const positons = createListCollection({
  items: [
    { label: "Professional", value: "professional" },
    { label: "Member", value: "member" },
  ],
});

export default function AddPeoplePage() {
  // const [imageUrl, setImageUrl] = useState("https://png.pngtree.com/png-clipart/20210604/ourmid/pngtree-gray-male-avatar-png-image_3416112.jpg");

  const { register, handleSubmit, watch, control } = useForm<PersonProps>({
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
              <Input />
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

        <Button>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
