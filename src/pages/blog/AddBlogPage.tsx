import { Dispatch, SetStateAction, useMemo, useState } from "react";
import { Box, Button, createListCollection, Dialog, Grid, GridItem, Heading, Icon, Image, Input, Portal, Select, Tabs, Text } from "@chakra-ui/react";
import { Field } from "@/components/ui/field";

import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import ImageExtension from "@tiptap/extension-image"

import { Control, RichTextEditor } from "../../components/ui/rich-text-editor"
import { LuImage, LuLink, LuUpload } from "react-icons/lu";
import { useGetAllAssets } from "@/hooks/asset";
import { useCreateBlog, useGetAllBlogCategories } from "@/hooks/blog";
import { Controller, FormProvider, useController, useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateBlogProps, CreateBlogSchema } from "@/features/wordpress/blog.service";
import { useNavigate } from "react-router";
import { Checkbox } from "@/components/ui/checkbox";

export function ImageDialog({ open, setOpen, onEmbedUrlSave, onAssetFileSave }: { open: boolean, setOpen: Dispatch<SetStateAction<boolean>>, onEmbedUrlSave: (url: string) => void, onAssetFileSave: (url: string) => void }) {

    const { data: assets, isLoading, isError } = useGetAllAssets()

    function onCancel() {
        setOpen(false)
    }

    return (
        <Dialog.Root open={open} onOpenChange={(e) => setOpen(e.open)}>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content maxW="6xl">
                        <Dialog.Header>
                            <Dialog.Title>Insert Image</Dialog.Title>
                        </Dialog.Header>

                        <Dialog.Body>
                            <Tabs.Root defaultValue="url">
                                <Tabs.List>
                                    <Tabs.Trigger value="url">
                                        <LuLink /> Embed URL
                                    </Tabs.Trigger>
                                    <Tabs.Trigger value="upload">
                                        <LuUpload /> Assets
                                    </Tabs.Trigger>
                                </Tabs.List>

                                <Tabs.Content value="url">
                                    <Box display="flex" gap="2" mt="4">
                                        <Input
                                            placeholder="Enter image URL"
                                            id="image-url-input"
                                        />
                                        <Button
                                            onClick={() => {
                                                const url = (
                                                    document.getElementById(
                                                        "image-url-input",
                                                    ) as HTMLInputElement
                                                ).value
                                                if (url)
                                                    onEmbedUrlSave(url)
                                                setOpen(false)
                                            }}
                                        >
                                            Insert
                                        </Button>
                                    </Box>
                                </Tabs.Content>

                                <Tabs.Content value="upload">
                                    {isLoading && <Box>Loading...</Box>}
                                    {isError && <Box>Error</Box>}
                                    <Grid templateColumns={"repeat(4, 1fr)"} gap={2}>
                                        {assets && assets.map(asset =>
                                            <GridItem onClick={() => onAssetFileSave(asset.url)} key={asset.id}>
                                                <Image src={asset.url} />
                                            </GridItem>)}
                                    </Grid>
                                </Tabs.Content>
                            </Tabs.Root>
                        </Dialog.Body>

                        <Dialog.Footer mt="4">
                            <Button variant="outline" onClick={onCancel}>
                                Cancel
                            </Button>
                        </Dialog.Footer>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export function CoverPhoto() {
    const { control } = useFormContext<CreateBlogProps>()
    const { field: { onChange, value } } = useController({ control: control, name: "coverPhoto" })

    const [open, setOpen] = useState(false)

    return (
        <>
            <Box maxW={"fit-content"}
                onClick={() => setOpen(true)}
            >
                {value ? <Box mb={8}><Image src={value} /></Box> :
                    <Box
                        display={"flex"} flexDirection={"column"}
                        paddingX={12} paddingY={32} mb={8}
                        alignItems={"center"} maxW={238}
                        border={"1px"}
                        borderStyle={"ridge"}>
                        <Icon><LuUpload /></Icon>
                        <Text textWrap={"nowrap"}>Only 1 file allowed</Text>
                    </Box>}

            </Box>
            <ImageDialog
                open={open}
                setOpen={setOpen}
                onEmbedUrlSave={(url) => onChange(url)}
                onAssetFileSave={(url) => onChange(url)} />
        </>
    )
}

function BlogCategorySelect() {

    const { control } = useFormContext<CreateBlogProps>()
    const { field } = useController({ control, name: "categoryId" })
    const { data: unmemoizedBlogCategories, isLoading, isError } = useGetAllBlogCategories()

    const blogCategories = useMemo(() => {

        if (!unmemoizedBlogCategories) return createListCollection<{
            label: string;
            value: string;
        }>({ items: [] })

        return createListCollection({
            items: unmemoizedBlogCategories?.map(item => ({ label: item.name, value: item.id.toString() }))
        })
    }, [unmemoizedBlogCategories])

    if (isError) return <Text>{"Error"}</Text>

    if (isLoading) return <Text>Loading...</Text>

    return (
        <Select.Root collection={blogCategories} mb={8}
            name={field.name}
            value={[field.value.toString()]}
            onValueChange={({ value }) => field.onChange(value[0])}
            onInteractOutside={() => field.onBlur()}>
            <Select.Label>Category</Select.Label>
            <Select.Control>
                <Select.Trigger>
                    <Select.ValueText placeholder="Select Category" />
                </Select.Trigger>
                <Select.IndicatorGroup>
                    <Select.Indicator />
                </Select.IndicatorGroup>
            </Select.Control>
            <Portal>
                <Select.Positioner>
                    <Select.Content>
                        {blogCategories.items.map((category) => (
                            <Select.Item item={category} key={category.value}>
                                {category.label}
                                <Select.ItemIndicator />
                            </Select.Item>
                        ))}
                    </Select.Content>
                </Select.Positioner>
            </Portal>
        </Select.Root>
    )
}

function BlogForm() {

    const form = useForm({
        defaultValues: {
            title: "",
            categoryId: ""
        },
        resolver: zodResolver(CreateBlogSchema)
    })
    const { field: { onChange: onContentChange, value: content } } = useController({ control: form.control, name: "content" })

    const [open, setOpen] = useState(false)

    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        immediatelyRender: false,
        content,
        onUpdate({ editor }) {
            onContentChange(editor.getHTML())
        },
        extensions: [StarterKit, Highlight.configure({ multicolor: true }), ImageExtension],
        textDirection: "auto",
    })

    const createBlogMutation = useCreateBlog()

    const navigate = useNavigate()

    const handleSaveBtn = form.handleSubmit(async (blogCategory) => {
        await createBlogMutation.mutateAsync(blogCategory, {
            onSuccess: () => navigate("/dashboard/blogs", { replace: true })
        })
    })

    if (!editor) return null

    return (
        <FormProvider {...form}>
            <Box>
                <Heading mb={8} size={"2xl"}>Create New Blog</Heading>
                <CoverPhoto />
                <BlogCategorySelect />
                <Field label={"Title"} mb={8}>
                    <Controller control={form.control} name="title"
                        render={({ field }) => <Input value={field.value} onChange={field.onChange} />} />
                </Field>
                <Field label={"Description"} mb={8}>
                    <Controller control={form.control} name="description"
                        render={({ field }) => <Input value={field.value} onChange={field.onChange} />} />
                </Field>
                <Controller
                    control={form.control}
                    name="visibility"
                    render={({ field }) => (
                        <Field>
                            <Checkbox
                                mb={8}
                                checked={field.value}
                                onCheckedChange={({ checked }) => field.onChange(checked)}
                            >
                                {field.value ? "Public" : "Private"}
                            </Checkbox>
                        </Field>
                    )}
                />
                <RichTextEditor.Root editor={editor}>
                    <RichTextEditor.Toolbar>
                        <RichTextEditor.ControlGroup>
                            <Control.Bold />
                            <Control.Italic />
                            <Control.Underline />
                            <Control.Strikethrough />
                        </RichTextEditor.ControlGroup>
                        <RichTextEditor.ControlGroup >
                            <Control.H1 />
                            <Control.H2 />
                            <Control.H3 />
                            <Control.H4 />
                        </RichTextEditor.ControlGroup>
                        <RichTextEditor.ControlGroup>
                            <Control.Highlight />
                            <Control.ButtonControl icon={<LuImage />} label={"Insert Image"} variant={"ghost"} onClick={() => setOpen(true)} />
                        </RichTextEditor.ControlGroup>
                    </RichTextEditor.Toolbar>
                    <RichTextEditor.Content />
                </RichTextEditor.Root>
                <Button mt={4} onClick={handleSaveBtn}>Save</Button>

                <ImageDialog
                    open={open}
                    setOpen={setOpen}
                    onEmbedUrlSave={(url) => editor.chain().focus().setImage({ src: url }).run()}
                    onAssetFileSave={(url) => editor.chain().focus().setImage({ src: url }).run()} />
            </Box>
        </FormProvider>
    )
}

export default function AddBlogPage() {

    return (
        <BlogForm />
    )
}