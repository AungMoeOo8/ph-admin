import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { NumberInputField } from "@/components/ui/number-input";
import { ServiceProps } from "@/features/firebase/service/serviceProps";
import {
  Box,
  Button,
  Card,
  Fieldset,
  Flex,
  Heading,
  IconButton,
  Input,
  MenuContent,
  MenuItem,
  MenuRoot,
  MenuTrigger,
  NumberInputRoot,
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  LuDollarSign,
  LuEllipsisVertical,
  LuPencil,
  LuTrash2,
} from "react-icons/lu";
import { useNavigate } from "react-router";

export default function AddPeoplePage() {
  const navigate = useNavigate();

  const { register, handleSubmit, control } = useForm<ServiceProps>({
    defaultValues: {
      id: "",
      name: "",
      visibility: false,
    },
  });

  const handleSaveBtn: SubmitHandler<ServiceProps> = (data) => {
    // const person = getValues();
    // person.id = person.name.trim().toLowerCase();
    // await savePerson(person);

    console.log({ service: data });

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
            <Textarea rows={5} {...register("description")} />
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
          <Textarea rows={5} {...register("ending")} />
        </Field>

        <Heading size={"2xl"}>Fees</Heading>
        <Flex gap={8} flexDir={{ base: "column", lg: "row" }}>
          <Flex flexBasis={"1/2"}>
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
          </Flex>

          <Flex flexBasis={"1/2"}>
            <SimpleGrid
              width={"100%"}
              height={"min-content"}
              gap={4}
              flexDir={{ base: "column", lg: "row" }}
            >
              {["Online", "In Person"].map((item) => (
                <Card.Root flexGrow={1}>
                  <Card.Body>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      gapX={4}
                    >
                      <Text fontSize={"lg"} fontWeight={"medium"}>
                        {item}
                      </Text>

                      <MenuRoot>
                        <MenuTrigger asChild>
                          <IconButton size={"sm"} variant={"outline"}>
                            <LuEllipsisVertical />
                          </IconButton>
                        </MenuTrigger>
                        <MenuContent
                          position={"absolute"}
                          top={"68px"}
                          right={0}
                        >
                          <MenuItem
                            value="new-txt"
                            justifyContent={"space-between"}
                          >
                            Edit
                            <LuPencil />
                          </MenuItem>
                          <MenuItem
                            value="new-txt"
                            justifyContent={"space-between"}
                          >
                            Delete
                            <LuTrash2 />
                          </MenuItem>
                        </MenuContent>
                      </MenuRoot>
                    </Flex>
                    <Text display={"flex"} alignItems={"center"}>
                      <LuDollarSign />
                      {Intl.NumberFormat().format(15000)}
                    </Text>
                    <Text mt={4} fontSize={"sm"}>
                      {
                        "(One sessionကို မိနစ် 50 ပါရှင့်။ အဆင်ပြေတဲ့အချိန် ညှိနှိုင်းပြီး booking ယူလို့ရပါတယ်ရှင့်။)"
                      }
                    </Text>
                  </Card.Body>
                </Card.Root>
              ))}
            </SimpleGrid>
          </Flex>
        </Flex>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
