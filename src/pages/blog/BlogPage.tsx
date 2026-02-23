import { BlogProps } from "@/features/wordpress/blog.service";
import { useGetBlogs } from "@/hooks/blog";
import { Box, Button, Flex, Grid, GridItem, Text, Image, Pagination, IconButton } from "@chakra-ui/react";
import { useState } from "react";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router"

function BlogComponent({ blog }: { blog: BlogProps }) {
    return (
        <Link to={`/dashboard/blogs/${blog.id}`}>
            <GridItem border={"solid 1px"} borderColor={"#d1d1d1"} borderRadius={8} overflow={"hidden"}>
                <Image src={blog.coverPhoto} />
                <Text px={2} py={2}>{blog.title}</Text>
            </GridItem>
        </Link>
    )
}

const PageSize = 12;

export default function BlogPage() {

    const [page, setPage] = useState(1)

    const { data, isLoading, isError } = useGetBlogs(page, PageSize)

    if (isError) return <Text>{"Error"}</Text>

    if (isLoading) return <Text>Loading...</Text>

    return (
        <Box>
            <Flex justifyContent={"space-between"} mb={8}>
                <Button asChild>
                    <Link to={"/dashboard/blogs/new"}>
                        <LuPlus /> Add
                    </Link>
                </Button>
                <Button asChild>
                    <Link to={"/dashboard/blogs/categories"}>
                        Manage Category
                    </Link>
                </Button>
            </Flex>
            <Grid mb={8} templateColumns={"repeat(4, 1fr)"} gap={4}>
                {
                    data && data.data.map(blog => <BlogComponent blog={blog} key={blog.id} />)
                }
            </Grid>
            <Pagination.Root defaultPage={1} pageSize={PageSize} count={data?.pagination.total} onPageChange={(e) => setPage(e.page)}>
                <Pagination.PrevTrigger />
                {/* <Pagination.Ellipsis /> */}
                <Pagination.Items
                    render={(page) => (
                        <IconButton variant={{ base: "ghost", _selected: "outline" }}>
                            {page.value}
                        </IconButton>
                    )} />
                <Pagination.PageText />
                <Pagination.NextTrigger />
            </Pagination.Root>
        </Box>
    )
}