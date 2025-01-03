import { toaster } from "@/components/ui/toaster";
import {
  ActivityProps,
  getActivities,
} from "@/features/wordpress/activity.service";
import {
  deletePerson,
} from "@/features/wordpress/people.service";
import {
  Box,
  Button,
  Flex,
  Image,
  SimpleGrid,
  Stack,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { LuPencil, LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

export default function ActivityPage() {
  const [activityList, setActivityList] = useState<ActivityProps[]>([]);

  useEffect(() => {
    (async () => {
      const response = await getActivities();
      const activities = response.data;
      setActivityList(activities);
    })();
  }, []);

  async function handleDeleteBtn(id: string) {
    const response = await deletePerson(id);
    toaster.create({
      type: "success",
      description: "Deleting successful.",
    });

    if (response.isSuccess) {
      setActivityList(activityList.filter((activity) => activity.id != id));
    }
  }

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/dashboard/activity/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      <SimpleGrid>
        {activityList.map((activity) => (
          <Box key={activity.id}>
            <Image src={activity.url} />
          </Box>
        ))}
      </SimpleGrid>
    </Stack>
  );
}
