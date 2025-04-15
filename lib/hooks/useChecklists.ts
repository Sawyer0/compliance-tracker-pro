import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSupabase } from './useSupabase';
import { fetchChecklists, updateChecklistItem } from '../services/checklist';
import { ChecklistItem } from '@/types/checklist';

export function useChecklists(departmentId?: string) {
  const { client } = useSupabase();
  const queryClient = useQueryClient();

  // Fetch checklists for a specific department
  const checklistsQuery = useQuery({
    queryKey: ['checklists', departmentId],
    queryFn: async () => {
      if (!client) throw new Error('Supabase client not initialized');
      
      if (departmentId) {
        const { data, error } = await client
          .from('checklists')
          .select('*')
          .eq('department_id', departmentId);
        
        if (error) throw error;
        return data;
      }
      
      // If no departmentId, fetch all checklists
      const { data, error } = await fetchChecklists(client);
      if (error) throw error;
      return data;
    },
    enabled: !!client, // Only run the query when the Supabase client is available
  });

  // Update a checklist item
  const updateChecklistMutation = useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ChecklistItem> }) => {
      if (!client) throw new Error('Supabase client not initialized');
      const { data, error } = await updateChecklistItem(client, id, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate the checklists query to refetch data
      queryClient.invalidateQueries({ queryKey: ['checklists', departmentId] });
    },
  });

  return {
    checklists: checklistsQuery.data || [],
    isLoading: checklistsQuery.isLoading,
    isError: checklistsQuery.isError,
    error: checklistsQuery.error,
    updateChecklist: updateChecklistMutation.mutate,
    isUpdating: updateChecklistMutation.isPending
  };
} 