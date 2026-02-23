import { Field } from "@/components/ui/field";
import { toaster } from "@/components/ui/toaster";
import { CreateBlogCategorySchema } from "@/features/wordpress/blog.service";
import { useCreateBlogCategory, useDeleteBlogCategory, useGetAllBlogCategories, useGetBlogCategoryById, useUpdateBlogCategory } from "@/hooks/blog";
import { Badge, Box, Button, CloseButton, Dialog, IconButton, Input, Portal, Table, Text } from "@chakra-ui/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { DevTool } from "@hookform/devtools"
import { Checkbox } from "@/components/ui/checkbox";

function BlogCategoryCreateDialog() {

    const [open, setOpen] = useState(false)

    const { control, handleSubmit } = useForm({
        defaultValues: {
            visibility: false
        },
        resolver: zodResolver(CreateBlogCategorySchema)
    })

    const createBlogCategoryMutation = useCreateBlogCategory()

    const handleSaveBtn = handleSubmit(async (blogCategory) => {
        await createBlogCategoryMutation.mutateAsync(blogCategory, {
            onSuccess: () => setOpen(false)
        })
    })

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
            <Dialog.Trigger asChild>
                <Button mb={10}>
                    <LuPlus />Add
                </Button>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Create Blog Category</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body display={"flex"} flexDirection={"column"} gapY={4}>
                            <Field label="Slug">
                                <Controller control={control} name="slug"
                                    render={({ field }) => (
                                        <Input onChange={field.onChange} />
                                    )} />
                            </Field>
                            <Field label="Name">
                                <Controller control={control} name="name"
                                    render={({ field }) => (
                                        <Input onChange={field.onChange} />
                                    )} />
                            </Field>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button onClick={handleSaveBtn}>Save</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

function BlogCategoryEditDialogForm({ blogCategoryId, setOpen }: { blogCategoryId: number, setOpen: React.Dispatch<React.SetStateAction<boolean>> }) {
    const { data, isLoading, isError } = useGetBlogCategoryById(blogCategoryId)

    const { control, handleSubmit } = useForm({
        values: data,
        resolver: zodResolver(CreateBlogCategorySchema)
    })

    const updateBlogCategoryMutation = useUpdateBlogCategory(blogCategoryId)

    const handleSaveBtn = handleSubmit(async (blogCategory) => {
        await updateBlogCategoryMutation.mutateAsync(blogCategory, {
            onSuccess: () => {
                toaster.create({
                    type: "success",
                    description: "Updating successful.",
                });
                setOpen(false)
            },
            onError: (error) => {
                toaster.create({
                    type: "error",
                    description: error.message,
                });
            },
        })
    })

    if (isError) return <Text>{"Error"}</Text>

    if (isLoading) return <Text>Loading...</Text>

    return (
        <>
            <Dialog.Body display={"flex"} flexDirection={"column"} gapY={4}>
                <Field label="Slug">
                    <Controller control={control} name="slug"
                        render={({ field }) => (
                            <Input value={field.value} onChange={field.onChange} />
                        )} />
                </Field>
                <Field label="Name">
                    <Controller control={control} name="name"
                        render={({ field }) => (
                            <Input value={field.value} onChange={field.onChange} />
                        )} />
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
            </Dialog.Body>
            <Dialog.Footer>
                <Dialog.ActionTrigger asChild>
                    <Button variant="outline">Cancel</Button>
                </Dialog.ActionTrigger>
                <Button onClick={handleSaveBtn}>Save</Button>
            </Dialog.Footer>
        </>
    )
}

function BlogCategoryEditDialog({ blogCategoryId }: { blogCategoryId: number }) {

    const [open, setOpen] = useState(false)

    return (
        <Dialog.Root open={open} onOpenChange={({ open }) => setOpen(open)}>
            <Dialog.Trigger asChild>
                <IconButton colorPalette={"cyan"}><LuPencil /></IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Edit Blog Category</Dialog.Title>
                        </Dialog.Header>
                        <BlogCategoryEditDialogForm blogCategoryId={blogCategoryId} setOpen={setOpen} />
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

function DeleteButtonDialog({ blogCategoryId }: { blogCategoryId: number }) {

    const deleteBlogCategoryMutation = useDeleteBlogCategory()

    const handleDeleteBtn = async (blogCategoryId: number) => await deleteBlogCategoryMutation.mutateAsync(blogCategoryId, {
        onSuccess: () => {
            toaster.create({
                type: "success",
                description: "Deleting successful.",
            });
        },
        onError: (error) => {
            toaster.create({
                type: "error",
                description: error.message,
            });
        },
    })

    return (
        <Dialog.Root>
            <Dialog.Trigger asChild>
                <IconButton colorPalette={"red"}><LuTrash /></IconButton>
            </Dialog.Trigger>
            <Portal>
                <Dialog.Backdrop />
                <Dialog.Positioner>
                    <Dialog.Content>
                        <Dialog.Header>
                            <Dialog.Title>Delete Blog Category</Dialog.Title>
                        </Dialog.Header>
                        <Dialog.Body>
                            <Text>This will permanently remove the category. It might affects the blogs if this category is in use.</Text>
                        </Dialog.Body>
                        <Dialog.Footer>
                            <Dialog.ActionTrigger asChild>
                                <Button variant="outline">Cancel</Button>
                            </Dialog.ActionTrigger>
                            <Button colorPalette={"red"} onClick={() => handleDeleteBtn(blogCategoryId)}>Yes, Delete</Button>
                        </Dialog.Footer>
                        <Dialog.CloseTrigger asChild>
                            <CloseButton size="sm" />
                        </Dialog.CloseTrigger>
                    </Dialog.Content>
                </Dialog.Positioner>
            </Portal>
        </Dialog.Root>
    )
}

export default function BlogCategoryPage() {

    const { data, isLoading, isError } = useGetAllBlogCategories()

    if (isError) return <Text>{"Error"}</Text>

    if (isLoading) return <Text>Loading...</Text>

    return (
        <Box>
            <BlogCategoryCreateDialog />
            <Table.Root size="lg">
                <Table.Header>
                    <Table.Row>
                        <Table.ColumnHeader>No.</Table.ColumnHeader>
                        <Table.ColumnHeader>Slug</Table.ColumnHeader>
                        <Table.ColumnHeader>Name</Table.ColumnHeader>
                        <Table.ColumnHeader>Status</Table.ColumnHeader>
                        <Table.ColumnHeader></Table.ColumnHeader>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {data && data.map((item, index) => (
                        <Table.Row key={item.id}>
                            <Table.Cell>{index + 1}</Table.Cell>
                            <Table.Cell>{item.slug}</Table.Cell>
                            <Table.Cell>{item.name}</Table.Cell>
                            <Table.Cell>
                                <Badge
                                    size={"lg"}
                                    colorPalette={item.visibility ? "green" : "orange"}
                                >
                                    {item.visibility ? "Public" : "Private"}
                                </Badge>
                            </Table.Cell>
                            <Table.Cell
                                display={"flex"}
                                justifyContent={"center"}
                                gapX={2}>
                                <BlogCategoryEditDialog blogCategoryId={item.id} />
                                <DeleteButtonDialog blogCategoryId={item.id} />
                            </Table.Cell>
                        </Table.Row>
                    ))}
                </Table.Body>
            </Table.Root>
        </Box>
    )
}