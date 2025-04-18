import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import {
  fetchChecklists,
  updateChecklistItem,
  createChecklistItem,
} from "../services/checklist";
import { ChecklistItem } from "@/types/checklist";
import React from "react";

// Cache time constants
const CACHE_TIME = 5 * 60 * 1000; // 5 minutes
const STALE_TIME = 60 * 1000; // 1 minute

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
    staleTime: STALE_TIME,
    gcTime: CACHE_TIME,
  });

  // Prefetch related data that might be needed
  const prefetchDepartmentData = async () => {
    if (!client || !departmentId) return;

    // Prefetch department details
    queryClient.prefetchQuery({
      queryKey: ["department", departmentId],
      queryFn: async () => {
        const { data, error } = await client
          .from("departments")
          .select("*")
          .eq("id", departmentId)
          .single();

        if (error) throw error;
        return data;
      },
      staleTime: STALE_TIME,
    });
  };

  // Call prefetch when available
  React.useEffect(() => {
    prefetchDepartmentData();
  }, [departmentId, client]);

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
    onSuccess: (data) => {
      // Optimistic update - immediately update the cache
      queryClient.setQueryData(
        ["checklists", departmentId],
        (oldData: ChecklistItem[] | undefined) => {
          if (!oldData) return [data];
          return oldData.map((item) =>
            item.id === data.id ? { ...item, ...data } : item
          );
        }
      );

      // Then refetch to ensure consistency
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
    onSuccess: (data) => {
      // Optimistic update - immediately update the cache
      queryClient.setQueryData(
        ["checklists", departmentId],
        (oldData: ChecklistItem[] | undefined) => {
          if (!oldData) return [data];
          return [...oldData, data];
        }
      );

      // Then refetch to ensure consistency
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
