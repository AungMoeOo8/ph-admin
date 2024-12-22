import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { NumberInputField } from "@/components/ui/number-input";
import { savePerson } from "@/firebase/people/peopleService";
import { ServiceProps } from "@/firebase/service/serviceProps";
import {
  Box,
  Button,
  Card,
  createListCollection,
  Fieldset,
  Flex,
  Heading,
  Image,
  Input,
  NumberInputLabel,
  NumberInputRoot,
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

export default function AddPeoplePage() {
  // const [imageUrl, setImageUrl] = useState("https://png.pngtree.com/png-clipart/20210604/ourmid/pngtree-gray-male-avatar-png-image_3416112.jpg");

  const navigate = useNavigate();

  const { register, handleSubmit, watch, control, getValues, setValue } =
    useForm<ServiceProps>({
      defaultValues: {
        id: "",
        name: "",
        status: false,
      },
    });

  const [inputValue, setInputValue] = useState("");

  const handleSaveBtn = async () => {
    const person = getValues();
    person.id = person.name.trim().toLowerCase();
    await savePerson(person);

    navigate("/admin/service", { replace: true });
  };

  return (
    <Box>
      <Fieldset.Root>
        <Heading size={"2xl"}>Create new service</Heading>
        <Fieldset.Content>
          <Field required label="Name">
            <Input {...register("name")} />
          </Field>

          <Field required label="Provider">
            <Input {...register("provider")} />
          </Field>

          <Field required label="Description">
            <Textarea rows={5} {...register("biography")} />
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

        <Field label="Ending">
          <Textarea rows={5} {...register("biography")} />
        </Field>

        <Heading size={"2xl"}>Fees</Heading>
        <Flex gap={8}>
          <Box>
            <Fieldset.Root>
              <Field required label="Type">
                <Input />
              </Field>
              <Field required label="Amount">
                <NumberInputRoot min={0}>
                  <NumberInputField />
                </NumberInputRoot>
              </Field>
              <Field label="Description">
                <Textarea rows={5} />
              </Field>
            </Fieldset.Root>
          </Box>

          {[1, 2].map((item) => (
            <Card.Root>
              <Card.Body>
                <Fieldset.Root>
                  <Field required label="Type">
                    <Input />
                  </Field>
                  <Field required label="Amount">
                    <NumberInputRoot min={0}>
                      <NumberInputField />
                    </NumberInputRoot>
                  </Field>
                  <Field label="Description">
                    <Textarea rows={5} />
                  </Field>
                </Fieldset.Root>
              </Card.Body>
            </Card.Root>
          ))}
        </Flex>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
