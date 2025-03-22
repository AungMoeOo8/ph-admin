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
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";

function ActivityComp({
  activity,
  handleDeleteBtn,
}: {
  activity: ActivityProps;
  handleDeleteBtn: (id: string, filePath: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: activity.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      ref={setNodeRef}
      key={activity.indexNumber}
      position={"relative"}
      borderWidth={1}
      borderRadius={"lg"}
      overflow={"hidden"}
      style={style}
      {...attributes}
      {...listeners}
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

  const sensors = useSensors(useSensor(PointerSensor));

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

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over!.id) {
      queryClient.setQueryData<ActivityProps[]>(["activities"], (prev) => {
        const oldIndex = parseInt(active.id.toString());
        const newIndex = parseInt(over!.id.toString());

        const newArr = arrayMove(prev!, oldIndex, newIndex).map(
          (item, index) => {
            item.indexNumber = index;
            return item;
          }
        );

        return newArr;
      });
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
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={data}>
          {data != undefined && (
            <SimpleGrid id="grid" columns={{ base: 1, sm: 2, lg: 4 }} gap={2}>
              {data.map((activity, index) => {
                activity.indexNumber = index;
                return (
                  <ActivityComp
                    key={index}
                    activity={activity}
                    handleDeleteBtn={() =>
                      handleDeleteBtn(activity.id, activity.imageUrl)
                    }
                  />
                );
              })}
            </SimpleGrid>
          )}
        </SortableContext>
      </DndContext>
    </Stack>
  );
}

// .sort((a, b) => (a.indexNumber > b.indexNumber ? 0 : -1))
