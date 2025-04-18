import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import {
  fetchTags,
  createTag,
  assignTagsToChecklist,
  deleteTag,
} from "../services/tags";
import { Tag } from "@/types/checklist";

export function useTags() {
  const { client, loading: clientLoading } = useSupabase();
  const queryClient = useQueryClient();

  const tagsQuery = useQuery({
    queryKey: ["tags"],
    queryFn: async () => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await fetchTags(client);
      if (error) throw error;
      return data;
    },
    enabled: !!client,
  });

  const createTagMutation = useMutation({
    mutationFn: async (newTag: Omit<Tag, "id">) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await createTag(client, newTag);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });
    },
  });

  const deleteTagMutation = useMutation({
    mutationFn: async (tagId: string) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await deleteTag(client, tagId);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tags"] });

      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
  });

  const assignTagsMutation = useMutation({
    mutationFn: async ({
      checklistId,
      tagIds,
    }: {
      checklistId: string;
      tagIds: string[];
    }) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { error } = await assignTagsToChecklist(
        client,
        checklistId,
        tagIds
      );
      if (error) throw error;
      return true;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["checklists", variables.checklistId],
      });
      queryClient.invalidateQueries({ queryKey: ["checklists"] });
    },
  });

  return {
    tags: tagsQuery.data || [],
    isLoading: clientLoading || tagsQuery.isLoading,
    isError: tagsQuery.isError,
    error: tagsQuery.error,
    createTag: createTagMutation.mutate,
    deleteTag: deleteTagMutation.mutate,
    assignTags: assignTagsMutation.mutate,
    isCreating: createTagMutation.isPending,
    isDeleting: deleteTagMutation.isPending,
    isAssigning: assignTagsMutation.isPending,
  };
}
