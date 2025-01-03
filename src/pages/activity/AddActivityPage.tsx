import { Checkbox } from "@/components/ui/checkbox";
import { Field } from "@/components/ui/field";
import { v4 as uuidv4 } from "uuid";
import { Box, Button, Fieldset, Flex, Heading, Image } from "@chakra-ui/react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import {
  createActivity,
  ActivityProps,
} from "@/features/wordpress/activity.service";
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
import { uploadFile } from "@/features/wordpress/upload.service";
import { toaster } from "@/components/ui/toaster";

export default function AddActivityPage() {
  const navigate = useNavigate();

  const [uploadImage, setUploadImage] = useState<File[]>([]);

  const { register, handleSubmit, control, watch } = useForm<ActivityProps>({
    defaultValues: {
      id: "",
      url: "",
      visibility: false,
      indexNumber: 0,
    },
  });

  const previewImage = useMemo(() => {
    if (uploadImage.length > 0) {
      return URL.createObjectURL(uploadImage![0]);
    }
    return watch("url");
  }, [uploadImage, watch("url")]);

  const handleSaveBtn: SubmitHandler<ActivityProps> = async (activity) => {
    const uploadResponse = await uploadFile(uploadImage[0]);
    if (!uploadResponse.isSuccess) {
      toaster.create({
        type: "error",
        description: uploadResponse.message,
      });
      return;
    }

    activity.id = uuidv4();
    activity.url = uploadResponse.url;
    const activityCreateResponse = await createActivity(activity);
    if (!activityCreateResponse.isSuccess) {
      toaster.create({
        type: "error",
        description: uploadResponse.message,
      });
      return;
    }
    navigate("/admin/activity", { replace: true });
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
