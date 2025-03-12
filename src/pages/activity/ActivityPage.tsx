import { toaster } from "@/components/ui/toaster";
import {
  ActivityProps,
  deleteActivity,
  getActivities,
} from "@/features/wordpress/activity.service";
import { deleteFile } from "@/features/wordpress/upload.service";
import { useOnceQuery } from "@/hooks/useOnceQuery";
import {
  Box,
  Button,
  Flex,
  SimpleGrid,
  Stack,
  Image,
  Text,
  Badge,
} from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Reorder } from "motion/react";
import { LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

function ActivityComp({
  activity,
  handleDeleteBtn,
}: {
  activity: ActivityProps;
  handleDeleteBtn: (id: string, filePath: string) => Promise<void>;
}) {
  return (
    <Box
      key={activity.id}
      position={"relative"}
      borderWidth={1}
      borderRadius={"lg"}
      overflow={"hidden"}
    >
      <Image w={"auto"} h={150} src={activity.imageUrl} />
      <Flex>
        <Badge
          position={"absolute"}
          top={4}
          right={4}
          size={"sm"}
          colorPalette={activity.visibility ? "green" : "orange"}
        >
          {activity.visibility ? "Public" : "Private"}
        </Badge>
        <Button
          colorPalette={"red"}
          variant={"ghost"}
          w={"full"}
          onClick={async () =>
            await handleDeleteBtn(activity.id, activity.imageUrl)
          }
        >
          <LuTrash /> Delete
        </Button>
      </Flex>
    </Box>
  );
}

export default function ActivityPage() {
  const queryClient = useQueryClient();

  const { data, isPending } = useOnceQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const response = await getActivities();
      if (!response.isSuccess) throw new Error("");
      return response.data;
    },
    initialData: [],
  });

  const deleteFileMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const response = await deleteFile(filePath);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  const deleteActivityMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await deleteActivity(id);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  async function handleDeleteBtn(id: string, filePath: string) {
    await deleteFileMutation.mutateAsync(filePath, {
      onError: () => {
        toaster.create({
          type: "error",
          description: "Deleting failed.",
        });
        return;
      },
    });

    await deleteActivityMutation.mutateAsync(id, {
      onSuccess: (_, id) => {
        toaster.create({
          type: "success",
          description: "Deleting successful.",
        });
        queryClient.setQueryData(["activities"], () =>
          data?.filter((x) => x.id !== id)
        );
      },
      onError: () => {
        toaster.create({
          type: "error",
          description: "Deleting failed.",
        });
      },
    });
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
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      <Reorder.Group
        values={data}
        onReorder={(prev) => {
          queryClient.setQueryData(["activities"], prev);
        }}
      >
        {data != undefined && (
          <SimpleGrid id="grid" columns={{ base: 1, sm: 2, lg: 4 }} gap={2}>
            {data.map((activity, index) => (
              <Reorder.Item key={index} value={activity}>
                <ActivityComp
                  activity={activity}
                  handleDeleteBtn={() =>
                    handleDeleteBtn(activity.id, activity.imageUrl)
                  }
                />
              </Reorder.Item>
            ))}
          </SimpleGrid>
        )}
      </Reorder.Group>
    </Stack>
  );
}

// .sort((a, b) => (a.indexNumber > b.indexNumber ? 0 : -1))
