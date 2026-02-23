import { toaster } from "@/components/ui/toaster";
import { AssetProps } from "@/features/wordpress/asset.service";
import { useDeleteAsset, useGetAllAssets } from "@/hooks/asset";
import { Box, Button, CloseButton, Dialog, Flex, Grid, GridItem, Image, Portal, Text } from "@chakra-ui/react";
import { LuPlus, LuTrash } from "react-icons/lu";
import { Link, useNavigate } from "react-router";

function AssetComponent(asset: AssetProps) {

    const deleteAssetMutation = useDeleteAsset()
    const navigator = useNavigate()

    async function handleDeleteBtn() {
        await deleteAssetMutation.mutateAsync(asset.id, {
            onSuccess: () => {
                toaster.create({
                    type: "success",
                    description: "Asset deleted.",
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
    }
    return (
        <GridItem
            borderWidth={1}
            borderRadius={"lg"}
            overflow={"hidden"}
            height={"min-content"}
        >
            <Box position={"relative"}>
                {asset.name && <Text position={"absolute"} left={2} top={2} bgColor={"white"} rounded={"md"} px={2} py={1} fontSize={"sm"}>{asset.name}</Text>}
                <Image src={asset.url} />
            </Box>
            <Dialog.Root>
                <Dialog.Trigger asChild>
                    <Button variant="ghost" w="full" colorPalette={"red"}>
                        <LuTrash /> Delete
                    </Button>
                </Dialog.Trigger>
                <Portal>
                    <Dialog.Backdrop />
                    <Dialog.Positioner>
                        <Dialog.Content>
                            <Dialog.Header>
                                <Dialog.Title>Delete Asset</Dialog.Title>
                            </Dialog.Header>
                            <Dialog.Body>
                                <p>
                                    This will permanently remove the file. It might affects the blogs if this asset is in use.
                                </p>
                            </Dialog.Body>
                            <Dialog.Footer>
                                <Dialog.ActionTrigger asChild>
                                    <Button variant="outline">Cancel</Button>
                                </Dialog.ActionTrigger>
                                <Button colorPalette={"red"} onClick={async () =>
                                    await handleDeleteBtn()
                                }>Yes, delete</Button>
                            </Dialog.Footer>
                            <Dialog.CloseTrigger asChild>
                                <CloseButton size="sm" />
                            </Dialog.CloseTrigger>
                        </Dialog.Content>
                    </Dialog.Positioner>
                </Portal>
            </Dialog.Root>
        </GridItem>
    )
}

export default function AssetPage() {

    const { data, isLoading, isError } = useGetAllAssets()

    if (isError) return <Text>{"Error"}</Text>

    if (isLoading) return <Text>Loading...</Text>
    return (
        <Box>
            <Flex>
                <Button asChild>
                    <Link to={"/dashboard/assets/new"}>
                        <LuPlus /> Add
                    </Link>
                </Button>
            </Flex>
            <Grid mt={8} templateColumns={"repeat(3, 1fr)"} gap={4}>
                {data && data.map((item) =>
                    <AssetComponent {...item} key={item.id} />
                )}
            </Grid>
        </Box>
    )
}