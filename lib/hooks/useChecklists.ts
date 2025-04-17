import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import {
  fetchChecklists,
  updateChecklistItem,
  createChecklistItem,
} from "../services/checklist";
import { ChecklistItem } from "@/types/checklist";

export function useChecklists(departmentId?: string) {
  const { client, loading: clientLoading } = useSupabase();
  const queryClient = useQueryClient();

  const checklistsQuery = useQuery({
    queryKey: ["checklists", departmentId],
    queryFn: async () => {
      if (!client) throw new Error("Supabase client not initialized");

      if (departmentId) {
        const { data, error } = await client
          .from("checklists")
          .select("*")
          .eq("department_id", departmentId);

        if (error) throw error;
        return data;
      }

      const { data, error } = await fetchChecklists(client);
      if (error) throw error;
      return data;
    },
    enabled: !!client,
  });

  const updateChecklistMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<ChecklistItem>;
    }) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await updateChecklistItem(client, id, updates);
      if (error) {
        console.error("Error updating checklist item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists", departmentId] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      console.error("Error updating checklist:", error);
    },
  });

  const createChecklistMutation = useMutation({
    mutationFn: async (newItem: ChecklistItem) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await createChecklistItem(client, newItem);
      if (error) {
        console.error("Error creating checklist item:", error);
        throw error;
      }
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
    onError: (error) => {
      console.error("Error creating checklist:", error);
    },
  });

  return {
    checklists: checklistsQuery.data || [],
    isLoading:
      clientLoading ||
      (checklistsQuery.isLoading && checklistsQuery.fetchStatus !== "idle"),
    isError: checklistsQuery.isError,
    error: checklistsQuery.error,
    updateChecklist: updateChecklistMutation.mutate,
    createChecklist: createChecklistMutation.mutate,
    isUpdating: updateChecklistMutation.isPending,
    isCreating: createChecklistMutation.isPending,
  };
}
