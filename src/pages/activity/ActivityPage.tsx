import { toaster } from "@/components/ui/toaster";
import {
  ActivityProps,
  deleteActivity,
} from "@/features/wordpress/activity.service";
import { deleteFile } from "@/features/wordpress/upload.service";
import useDelayedAction from "@/hooks/useDelayedAction";
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
import {
  arrayMove,
  rectSortingStrategy,
  SortableContext,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef } from "react";
import { LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useActivitiesQuery } from "@/hooks/useActivitiesQuery";

function ActivityComp({
  activity,
  handleDeleteBtn,
}: {
  activity: ActivityProps;
  handleDeleteBtn: (id: string, filePath: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: activity.indexNumber });

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
          {/* {activity.visibility ? "Public" : "Private"} */}
          {activity.indexNumber}
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
  const isFirstRender = useRef(true);
  const sensors = useSensors(useSensor(PointerSensor));

  const { data, isPending } = useActivitiesQuery();

  useDelayedAction(
    async () => {
      if (isFirstRender.current) {
        isFirstRender.current = false;
        return;
      }

      const updatedData = data?.map((person, index) => {
        return { ...person, indexNumber: index };
      });

      console.log({ updatedData });

      // await reorderPeople(updatedData!);

      toaster.create({
        title: "Saved",
        description: "Reordered",
        type: "success",
      });
    },
    2000,
    []
  );

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
        if (!prev) return prev;

        const oldIndex = prev.findIndex(
          (item) => item.indexNumber === Number(active.id)
        );
        const newIndex = prev.findIndex(
          (item) => item.indexNumber === Number(over!.id)
        );
        console.log({ active, over });

        if (oldIndex === -1 || newIndex === -1) return prev;

        const newArr = arrayMove(prev, oldIndex, newIndex).map(
          (item, index) => ({
            ...item,
            indexNumber: index, // This ensures correct order is always maintained
          })
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
      <ErrorBoundary fallback={<div>Error</div>}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((activity) => activity.indexNumber)}
            strategy={rectSortingStrategy}
          >
            {data != undefined && (
              <SimpleGrid id="grid" columns={{ base: 1, sm: 2, lg: 4 }} gap={2}>
                {data.map((activity, index) => {
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
      </ErrorBoundary>
    </Stack>
  );
}
