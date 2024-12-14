import { Field } from "@/components/ui/field";
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
import { useState } from "react";

const positons = createListCollection({
  items: [
    { label: "Professional", value: "professional" },
    { label: "Member", value: "member" },
  ],
});

export default function AddPeoplePage() {
  const [imageUrl, setImageUrl] = useState("https://png.pngtree.com/png-clipart/20210604/ourmid/pngtree-gray-male-avatar-png-image_3416112.jpg");

  function handleImagePreview(e: React.ChangeEvent<HTMLInputElement>) {
    
  }
  return (
    <Box>
      <Fieldset.Root>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Name">
              <Input />
            </Field>
            <Field label="Position">
              <SelectRoot collection={positons}>
                <SelectTrigger>
                  <SelectValueText placeholder="Select position" />
                </SelectTrigger>
                <SelectContent>
                  {positons.items.map((postion) => (
                    <SelectItem item={postion} key={postion.value}>
                      {postion.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </SelectRoot>
            </Field>
            <Field label="Roles">
              <Input />
            </Field>
          </Fieldset.Content>

          <Fieldset.Content marginTop={0}>
            <Image
              src={imageUrl}
              objectFit={"contain"}
              aspectRatio={"golden"}
            />
            <Field label="Image Url">
              <Input placeholder="https://example.com/images/image.jpg" onChange={e => {}}/>
            </Field>
          </Fieldset.Content>
        </Flex>

        <Field label="Biography">
          <Textarea rows={5} />
        </Field>
      </Fieldset.Root>
    </Box>
  );
}
