import { getActivities } from "@/features/wordpress/activity.service";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Image,
  Text,
} from "@chakra-ui/react";
import { useQuery } from "@tanstack/react-query";
import { LuPlus } from "react-icons/lu";
import { Link } from "react-router";

export default function ActivityPage() {
  const { data, isPending } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await getActivities();
      if (!response.success) throw new Error("");
      return response.data;
    },
  });

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/dashboard/activity/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      {data != undefined && (
        <SimpleGrid id="grid">
          {data.map((activity) => (
            <Box key={activity.id}>
              <Image src={activity.imageUrl} />
            </Box>
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
}
