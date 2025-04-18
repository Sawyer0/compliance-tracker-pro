import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import {
  createDepartment,
  updateDepartment,
  deleteDepartment,
  fetchAllDepartments,
} from "../services/departments";

export interface DepartmentFormData {
  name: string;
  description?: string;
}

export function useDepartmentManagement() {
  const { client, loading: clientLoading } = useSupabase();
  const queryClient = useQueryClient();

  const departmentsQuery = useQuery({
    queryKey: ["allDepartments"],
    queryFn: async () => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await fetchAllDepartments(client);
      if (error) throw error;
      return data;
    },
    enabled: !!client,
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (department: DepartmentFormData) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await createDepartment(client, department);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDepartments"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async ({
      id,
      updates,
    }: {
      id: string;
      updates: Partial<DepartmentFormData>;
    }) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { data, error } = await updateDepartment(client, id, updates);
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate queries that depend on department data
      queryClient.invalidateQueries({ queryKey: ["allDepartments"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: string) => {
      if (!client) throw new Error("Supabase client not initialized");
      const { success, error } = await deleteDepartment(client, id);
      if (error) throw error;
      return success;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allDepartments"] });
      queryClient.invalidateQueries({ queryKey: ["departments"] });
    },
  });

  return {
    departments: departmentsQuery.data || [],
    isLoading: clientLoading || departmentsQuery.isLoading,
    isError: departmentsQuery.isError,
    error: departmentsQuery.error,
    createDepartment: createDepartmentMutation.mutate,
    updateDepartment: updateDepartmentMutation.mutate,
    deleteDepartment: deleteDepartmentMutation.mutate,
    isCreating: createDepartmentMutation.isPending,
    isUpdating: updateDepartmentMutation.isPending,
    isDeleting: deleteDepartmentMutation.isPending,
  };
}
