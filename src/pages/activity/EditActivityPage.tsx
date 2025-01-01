import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { v4 as uuidv4 } from "uuid";
import {
  Box,
  Button,
  Fieldset,
  Flex,
  Heading,
  Input,
} from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  createActivity,
  ActivityProps,
} from "@/features/wordpress/activity.service";
import { NumberInputField, NumberInputRoot } from "@/components/ui/number-input";

export default function AddActivityPage() {
  const navigate = useNavigate();

  const { register, handleSubmit, control } =
    useForm<ActivityProps>({
      defaultValues: {
        id: "",
        url: "",
        visibility: false,
        indexNumber: 0,
      },
    });

  const handleSaveBtn: SubmitHandler<ActivityProps> = async (activity) => {
    activity.id = uuidv4();
    await createActivity(activity);
    navigate("/admin/activity-images", { replace: true });
  };

  return (
    <Box>
      <Fieldset.Root>
        <Heading size={"2xl"}>Add activity image</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Field label="Image URL" required>
              <Input
                placeholder="https://example.com/images/image.jpg"
                {...register("url")}
              />
            </Field>

            <Field label="Order No." required>
              <NumberInputRoot>
                <NumberInputField {...register("indexNumber")}/>
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
        </Flex>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}