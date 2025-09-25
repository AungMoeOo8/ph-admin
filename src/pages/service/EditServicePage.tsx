import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
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
  SimpleGrid,
  Text,
  Textarea,
} from "@chakra-ui/react";
import {
  Control,
  Controller,
  SubmitHandler,
  useFieldArray,
  useForm,
} from "react-hook-form";
import {
  LuDollarSign,
  LuEllipsisVertical,
  LuPencil,
  LuTrash2,
  LuX,
} from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { useState } from "react";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
} from "@/components/ui/dialog";
import { toaster } from "@/components/ui/toaster";
import {
  ServiceProps,
} from "@/features/wordpress/service.service";
import { useGetServiceById, useUpdateService } from "@/hooks/service";

const FeesEditor = ({ control }: { control: Control<ServiceProps> }) => {
  const { fields, append, remove, update } = useFieldArray({
    control: control,
    name: "fees",
  });

  const initialFeeInputs = {
    type: "",
    amount: 0,
    description: "",
  };
  const [feeInputs, setFeeInputs] = useState<{
    type: string;
    amount: number;
    description: string;
  }>(initialFeeInputs);

  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const initialEditingState = {
    isEditing: false,
    index: -1,
  };
  const [editingState, setEditingState] = useState(initialEditingState);

  function syncFeeInputs(index: number) {
    const inputs = fields[index];
    setFeeInputs(inputs);
  }

  const handleFeeEditBtn = (index: number) => {
    if (
      feeInputs.type !== "" ||
      feeInputs.amount !== 0 ||
      feeInputs.description !== ""
    ) {
      setEditingState({ isEditing: true, index });
      setIsDialogOpen(true);
    } else {
      setEditingState({ isEditing: true, index });
      syncFeeInputs(index);
    }
  };

  const handleCancelEditBtn = () => {
    setEditingState(initialEditingState);
    setFeeInputs(initialFeeInputs);
  };

  const handleFeeDeleteBtn = (index: number) => {
    remove(index);
  };

  const handleFeeInputsAddOrEditBtn = () => {
    if (editingState.isEditing) {
      update(editingState.index, feeInputs);
      setEditingState(initialEditingState);
      setFeeInputs(initialFeeInputs);
      return;
    }

    append(feeInputs);
    setFeeInputs({
      type: "",
      amount: 0,
      description: "",
    });
  };

  return (
    <>
      <Flex gap={8} flexDir={{ base: "column", lg: "row" }}>
        <Flex flexBasis={"1/2"}>
          <Fieldset.Root
            onKeyDown={(e) => e.key == "Enter" && console.log("Entered")}
          >
            <Field required label="Type">
              <Input
                value={feeInputs.type}
                onChange={(e) =>
                  setFeeInputs((prev) => {
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
                  value={feeInputs.amount}
                  onChange={(e) =>
                    setFeeInputs((prev) => {
                      return {
                        type: prev.type,
                        amount: Number(e.target.value),
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
                value={feeInputs.description}
                onChange={(e) =>
                  setFeeInputs((prev) => {
                    return {
                      type: prev.type,
                      amount: prev.amount,
                      description: e.target.value,
                    };
                  })
                }
              />
            </Field>
            <Button onClick={handleFeeInputsAddOrEditBtn}>
              {editingState.isEditing ? "Editing done" : "Add new fee"}
            </Button>
          </Fieldset.Root>
        </Flex>

        <Flex flexBasis={"1/2"}>
          <SimpleGrid
            width={"100%"}
            height={"min-content"}
            gap={4}
            flexDir={{ base: "column", lg: "row" }}
          >
            {fields.map((service, index) => (
              <Card.Root key={index} flexGrow={1}>
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
                      <MenuContent position={"absolute"} top={"68px"} right={6}>
                        {editingState.index != index ? (
                          <MenuItem
                            value="editBtn"
                            justifyContent={"space-between"}
                            onClick={() => handleFeeEditBtn(index)}
                          >
                            Edit
                            <LuPencil />
                          </MenuItem>
                        ) : (
                          <MenuItem
                            value="editCancelBtn"
                            justifyContent={"space-between"}
                            onClick={handleCancelEditBtn}
                          >
                            Cancel
                            <LuX />
                          </MenuItem>
                        )}
                        <MenuItem
                          value="deleteBtn"
                          justifyContent={"space-between"}
                          onClick={() => handleFeeDeleteBtn(index)}
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

      <DialogRoot lazyMount role="alertdialog" open={isDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
          </DialogHeader>
          <DialogBody>
            <p>
              This action cannot be undone. This will remove your current fee
              infomations.
            </p>
          </DialogBody>
          <DialogFooter>
            <DialogActionTrigger asChild>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
            </DialogActionTrigger>
            <Button
              colorPalette="red"
              onClick={() => {
                syncFeeInputs(editingState.index);
                setIsDialogOpen(false);
              }}
            >
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogRoot>
    </>
  );
};

function EditServiceForm(service: ServiceProps) {
  const navigate = useNavigate();
  const updateServiceMutation = useUpdateService();

  const { register, handleSubmit, control } = useForm<ServiceProps>({
    defaultValues: service
  });

  const handleSaveBtn: SubmitHandler<ServiceProps> = async (service) => {
    await updateServiceMutation.mutateAsync(service, {
      onSuccess: (response) => {
        toaster.create({
          type: "success",
          description: "Service updated",
        });
        navigate("/dashboard/services", { replace: true });
      },
      onError: (error) => {
        toaster.create({
          type: "error",
          description: error.message,
        });
      },
    });
  };

  return (
    <>
      <Fieldset.Root>
        <Heading size={"2xl"}>Edit service</Heading>
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

          <Field label="Order No.">
            <NumberInputRoot>
              <NumberInputField {...register("indexNumber")} />
            </NumberInputRoot>
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
        <FeesEditor control={control} />

        <Button onClick={handleSubmit(handleSaveBtn)}>Save changes</Button>
      </Fieldset.Root>
    </>
  );
}

export default function EditServicePage() {
  const { serviceId } = useParams();

  const { data: service, isLoading, error } = useGetServiceById(Number(serviceId))

  return (
    <Box>
      {isLoading && <div>Loading...</div>}
      {error && <div>{error.message}</div>}
      {service && <EditServiceForm {...service} />}
    </Box>
  )

}
