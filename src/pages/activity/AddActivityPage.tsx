import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Fieldset, Flex, Heading, Image } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  NumberInputField,
  NumberInputRoot,
} from "@/components/ui/number-input";
import {
  FileUploadList,
  FileUploadRoot,
  FileUploadTrigger,
} from "@/components/ui/file-upload";
import { LuUpload } from "react-icons/lu";
import { useMemo, useState } from "react";
import { toaster } from "@/components/ui/toaster";
import { ActivityProps } from "@/features/wordpress/activity.service";
import { useFileUpload } from "@/hooks/file-upload";
import { useCreateActivity } from "@/hooks/activity";

export default function AddActivityPage() {
  const navigate = useNavigate();

  const [uploadImage, setUploadImage] = useState<File[]>([]);

  const { register, handleSubmit, control, watch } = useForm<ActivityProps>({
    defaultValues: {
      id: "",
      imageUrl: "",
      visibility: false,
      indexNumber: 0,
    },
  });

  const previewImage = useMemo(() => {
    if (uploadImage.length > 0) {
      return URL.createObjectURL(uploadImage![0]);
    }
    return watch("imageUrl");
  }, [uploadImage, watch("imageUrl")]);

  const uploadFileMutation = useFileUpload("activity");

  const createActivityMutation = useCreateActivity();

  const handleSaveBtn: SubmitHandler<ActivityProps> = async (activity) => {
    const response = await uploadFileMutation.mutateAsync(uploadImage[0], {
      onError: (error) => {
        toaster.create({
          type: "error",
          description: error.message,
        });
        return;
      },
    });

    activity.id = uuidv4();
    activity.imageUrl = response.url!;
    console.log(activity);
    await createActivityMutation.mutateAsync(activity, {
      onError(error) {
        toaster.create({
          type: "error",
          description: error.message,
        });
        return;
      },
    });

    navigate("/dashboard/activity", { replace: true });
  };

  return (
    <Box>
      <Fieldset.Root>
        <Heading size={"2xl"}>Add activity image</Heading>
        <Flex gap={4}>
          <Fieldset.Content>
            <Image
              w={320}
              src={previewImage}
              objectFit={"contain"}
              aspectRatio={"golden"}
            />
            <FileUploadRoot onFileAccept={(e) => setUploadImage(e.files)}>
              <FileUploadTrigger asChild>
                <Button variant="outline" size="sm">
                  <LuUpload /> Upload file
                </Button>
              </FileUploadTrigger>
              <FileUploadList />
            </FileUploadRoot>

            <Field label="Order No." required>
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
        </Flex>

        <Button onClick={handleSubmit(handleSaveBtn)}>Save</Button>
      </Fieldset.Root>
    </Box>
  );
}
