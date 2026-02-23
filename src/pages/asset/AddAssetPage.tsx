import { Box, FileUpload, Icon, Input, useFileUploadContext, Image, Button, Flex } from "@chakra-ui/react";
import { Controller, FormProvider, useController, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';
import { CreateAssetRequestForm, CreateAssetRequestSchema } from "@/features/wordpress/asset.service";
import { Field } from "@/components/ui/field";
import { LuUpload } from "react-icons/lu";
import { useCreateAsset } from "@/hooks/asset";
import { toaster } from "@/components/ui/toaster";
import { useNavigate } from "react-router";

const MAX_FILES = 1

function ImageDropzone() {

    const fileUpload = useFileUploadContext()
    const acceptedFiles = fileUpload.acceptedFiles

    if (acceptedFiles.length >= MAX_FILES) {
        return <Image src={URL.createObjectURL(acceptedFiles[0])} />
    }
    return (
        <FileUpload.Dropzone>
            <Icon size="md" color="fg.muted">
                <LuUpload />
            </Icon>
            <FileUpload.DropzoneContent>
                <Box>Drag and drop files here</Box>
                <Box color="fg.muted">
                    Only 1 file allowed
                </Box>
            </FileUpload.DropzoneContent>
        </FileUpload.Dropzone>
    )
}

function SaveButton() {

    const { handleSubmit } = useFormContext<CreateAssetRequestForm>()
    const navigator = useNavigate()

    const createAssetMutation = useCreateAsset();

    const handler = handleSubmit(async (data) => {
        await createAssetMutation.mutateAsync(data, {
            onSuccess: () => {
                toaster.create({
                    type: "success",
                    description: "Asset saved.",
                });
                navigator("/dashboard/assets", { replace: true });
            },
            onError: (error) => {
                toaster.create({
                    type: "error",
                    description: error.message,
                });
            },
        })
    })

    return (
        <Button onClick={() => handler()}>Save</Button>
    )
}

export default function AddAssetPage() {


    const form = useForm({
        resolver: zodResolver(CreateAssetRequestSchema)
    })

    const fileController = useController({ control: form.control, name: "file" })

    return (
        <FormProvider {...form}>
            <Flex flexDir={"column"} gapY={8}>
                <FileUpload.Root maxW="xl" alignItems="stretch" maxFiles={MAX_FILES} onFileAccept={details => fileController.field.onChange(details.files[0])}>
                    <FileUpload.HiddenInput />
                    <ImageDropzone />
                    <FileUpload.List clearable />
                </FileUpload.Root>
                <Field label={"Name (optional)"}>
                    <Controller control={form.control} name="name" render={({ field: { onChange } }) => <Input onChange={(e) => onChange(e.target.value)} />} />
                </Field>
                <SaveButton />
            </Flex>
        </FormProvider>
    )
}