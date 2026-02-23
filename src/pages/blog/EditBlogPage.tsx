import { Control, RichTextEditor } from "@/components/ui/rich-text-editor";
import { BlogProps, CreateBlogSchema, UpdateBlogProps } from "@/features/wordpress/blog.service";
import { useGetAllBlogCategories, useGetBlogById, useUpdateBlog } from "@/hooks/blog";
import { Box, Button, createListCollection, Heading, Input, Portal, Select, Text } from "@chakra-ui/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { Field } from "@/components/ui/field";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit"
import Highlight from "@tiptap/extension-highlight"
import ImageExtension from "@tiptap/extension-image"

import { useMemo, useState } from "react";
import { Controller, FormProvider, useController, useForm, useFormContext } from "react-hook-form";
import { LuImage } from "react-icons/lu";
import { useNavigate, useParams } from "react-router";
import { CoverPhoto, ImageDialog } from "./AddBlogPage";
import Superscript from '@tiptap/extension-superscript'
import Subscript from '@tiptap/extension-subscript'
import TextAlign from '@tiptap/extension-text-align'
import { FontFamily } from '@tiptap/extension-text-style'
import { Checkbox } from "@/components/ui/checkbox";

function BlogCategorySelect() {

    const { control } = useFormContext<UpdateBlogProps>()
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

function EditBlogForm({ blog }: { blog: BlogProps }) {

    const form = useForm({
        values: {
            ...blog,
            categoryId: blog.categoryId.toString()
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
        extensions: [StarterKit, Highlight.configure({ multicolor: true }), ImageExtension, Superscript, Subscript, TextAlign, FontFamily],
        textDirection: "auto",
    })

    const updateBlogMutation = useUpdateBlog(blog.id)

    const navigate = useNavigate()

    const handleSaveBtn = form.handleSubmit(async (blog) => {
        await updateBlogMutation.mutateAsync(blog, {
            onSuccess: () => navigate("/dashboard/blogs", { replace: true })
        })
    })

    if (!editor) return null

    return (
        <FormProvider {...form}>
            <Box>
                <Heading mb={8} size={"2xl"}>Edit Blog</Heading>
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


export default function EditBlogPage() {

    const { blogId } = useParams()
    const { data, isLoading, isError, error } = useGetBlogById(Number(blogId))

    return (
        <Box>
            {isLoading && <div>Loading...</div>}
            {isError && <div>{error.message}</div>}
            {data && <EditBlogForm blog={data} />}
        </Box>
    )
}