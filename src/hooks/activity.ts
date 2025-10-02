import {
  ActivityProps,
  createActivity,
  deleteActivity,
  getActivities,
} from "@/features/wordpress/activity.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useGetAllActivities() {
  return useQuery({
    queryKey: ["activities"],
    queryFn: getActivities,
  });
}

export function useCreateActivity() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async ({ activity, file }: { activity: ActivityProps, file: File }) => createActivity(activity, file),
    onSuccess: async () => await qc.invalidateQueries({ queryKey: ["activities"] })
  });
}

export function useDeleteActivity() {
  return useMutation({
    mutationFn: deleteActivity
  });
}