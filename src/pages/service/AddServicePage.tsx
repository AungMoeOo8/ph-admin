import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { NumberInputField } from "@/components/ui/number-input";
import {
  ServiceProps,
} from "@/features/wordpress/service.service";
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
import { v4 as uuidv4 } from "uuid";
// import { useNavigate } from "react-router";
import { useState } from "react";

export default function AddPeoplePage() {
  // const navigate = useNavigate();

  const { register, handleSubmit, control, watch, getValues, setValue } =
    useForm<ServiceProps>({
      defaultValues: {
        id: "",
        provider: "",
        name: "",
        description: "",
        fees: [],
        ending: "",
        indexNumber: 0,
        visibility: false,
      },
    });

  const [feeInput, setFeeInput] = useState<{
    type: string;
    amount: number;
    description: string;
  }>({
    type: "",
    amount: 0,
    description: "",
  });

  const handleFeeInput = () => {
    const fees = getValues("fees");
    setValue("fees", [...fees, feeInput]);
    setFeeInput({
      type: "",
      amount: 0,
      description: "",
    });
  };

  const handleSaveBtn: SubmitHandler<ServiceProps> = async (service) => {
    service.id = uuidv4();
    // await createService(service);

    console.log({ service: service });

    // navigate("/admin/service", { replace: true });
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
            <Fieldset.Root
              onKeyDown={(e) => e.key == "Enter" && console.log("Entered")}
            >
              <Field required label="Type">
                <Input value={feeInput.type}
                  onChange={(e) =>
                    setFeeInput((prev) => {
                      return {
                        type: e.target.value,
                        amount: prev.amount,
                        description: prev.description,
                      };
                    })
                  }
                />
              </Field>
              <Field required label="Amount">
                <NumberInputRoot min={0}>
                  <NumberInputField
                  value={feeInput.amount}
                    onChange={(e) =>
                      setFeeInput((prev) => {
                        return {
                          type: prev.type,
                          amount: parseFloat(e.target.value),
                          description: prev.description,
                        };
                      })
                    }
                  />
                </NumberInputRoot>
              </Field>
              <Field label="Description">
                <Textarea
                  rows={5}
                  value={feeInput.description}
                  onChange={(e) =>
                    setFeeInput((prev) => {
                      return {
                        type: prev.type,
                        amount: prev.amount,
                        description: e.target.value,
                      };
                    })
                  }
                />
              </Field>
              <Button onClick={handleFeeInput}>Add to fees</Button>
            </Fieldset.Root>
          </Flex>

          <Flex flexBasis={"1/2"}>
            <SimpleGrid
              width={"100%"}
              height={"min-content"}
              gap={4}
              flexDir={{ base: "column", lg: "row" }}
            >
              {watch("fees").map((service) => (
                <Card.Root flexGrow={1}>
                  <Card.Body>
                    <Flex
                      justifyContent={"space-between"}
                      alignItems={"center"}
                      gapX={4}
                    >
                      <Text fontSize={"lg"} fontWeight={"medium"}>
                        {service.type}
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
                      {Intl.NumberFormat().format(service.amount)}
                    </Text>
                    <Text mt={4} fontSize={"sm"}>
                      {service.description}
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
