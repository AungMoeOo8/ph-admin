import { toaster } from "@/components/ui/toaster";
import {
  ActivityProps,
  reorderActivity,
} from "@/features/wordpress/activity.service";
import { deleteFile } from "@/features/wordpress/upload.service";
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
import { LuPlus, LuTrash } from "react-icons/lu";
import { Link } from "react-router";
import { ErrorBoundary } from "react-error-boundary";
import { useDeleteActivity, useGetAllActivities } from "@/hooks/activity";
import { LuGripVertical } from "react-icons/lu";

function ActivityComp({
  activity,
  handleDeleteBtn,
}: {
  activity: ActivityProps;
  handleDeleteBtn: (id: number, filePath: string) => Promise<void>;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: activity.indexNumber, data: activity });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Box
      position={"relative"}
      borderWidth={1}
      borderRadius={"lg"}
      overflow={"hidden"}
      style={style}
    >
      <Image w={"auto"} h={150} src={activity.imageUrl} />
      <Flex>
        <Badge
          ref={setNodeRef}
          {...attributes}
          {...listeners}
          position={"absolute"}
          top={4}
          right={4}
          py={2}
          colorPalette={"black"}
        >
          <LuGripVertical size={24} />
        </Badge>
        <Button
          zIndex={50}
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
  const qc = useQueryClient();
  const sensors = useSensors(useSensor(PointerSensor));

  const { data, isPending } = useGetAllActivities();

  const deleteFileMutation = useMutation({
    mutationFn: async (filePath: string) => {
      const response = await deleteFile(filePath);
      if (!response.isSuccess) throw new Error(response.message);
      return response;
    },
  });

  const { mutateAsync } = useDeleteActivity()

  async function handleDeleteBtn(id: number, filePath: string) {

    await deleteFileMutation.mutateAsync(filePath, {
      onError: () => {
        toaster.create({
          type: "error",
          description: "Deleting failed.",
        });
        return;
      },
    });

    await mutateAsync(id, {
      onSuccess: () => {
        toaster.create({
          type: "success",
          description: "Deleting successful.",
        });
        qc.invalidateQueries({ queryKey: ["activities"] })
      },
      onError: () => {
        toaster.create({
          type: "error",
          description: "Deleting failed.",
        });
      },
    });
  }

  async function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (active.id !== over!.id) {
      const oldIndex = data?.findIndex(
        (item) => item.indexNumber === Number(active.id)
      );
      const newIndex = data?.findIndex(
        (item) => item.indexNumber === Number(over!.id)
      );

      const newArr = arrayMove(data!, oldIndex!, newIndex!).map(
        (item, index) => ({
          ...item,
          indexNumber: index, // This ensures correct order is always maintained
        })
      );

      qc.setQueryData<ActivityProps[]>(["activities"], newArr);

      await reorderActivity(newArr);

      toaster.create({
        title: "Saved",
        description: "Reordered",
        type: "success",
      });
    }
  }

  return (
    <Stack gap="10" w={"full"}>
      <Flex>
        <Button asChild>
          <Link to={"/dashboard/activities/new"}>
            <LuPlus /> Add
          </Link>
        </Button>
      </Flex>
      {isPending && (
        <Box display={"grid"} placeContent={"center"}>
          <Text>Loading...</Text>
        </Box>
      )}
      {data && <ErrorBoundary fallback={<div>Error</div>}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={data.map((activity) => activity.indexNumber)}
            strategy={rectSortingStrategy}
          >
            <SimpleGrid id="grid" columns={{ base: 1, sm: 2, lg: 4 }} gap={2}>
              {data.map((activity, index) => {
                return (
                  <ActivityComp
                    key={index}
                    activity={activity}
                    handleDeleteBtn={async () =>
                      await handleDeleteBtn(activity.id, activity.imageUrl)
                    }
                  />
                );
              })}
            </SimpleGrid>
          </SortableContext>
        </DndContext>
      </ErrorBoundary>}
    </Stack>
  );
}
