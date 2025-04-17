import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import { fetchDepartmentUsers, DepartmentUser } from "../services/users";

/**
 * Custom hook to fetch users assigned to a specific department
 * @param departmentId The department ID to fetch users for
 * @returns Users associated with the department and loading/error states
 */
export function useDepartmentUsers(departmentId?: string) {
  const { client, loading: clientLoading } = useSupabase();

  const usersQuery = useQuery({
    queryKey: ["departmentUsers", departmentId],
    queryFn: async () => {
      if (!client) throw new Error("Supabase client not initialized");
      if (!departmentId) return [];

      const { data, error } = await fetchDepartmentUsers(client, departmentId);
      if (error) throw error;
      return data || [];
    },
    enabled: !!client && !!departmentId,
  });

  return {
    users: (usersQuery.data as DepartmentUser[]) || [],
    isLoading:
      clientLoading ||
      (usersQuery.isLoading && usersQuery.fetchStatus !== "idle"),
    isError: usersQuery.isError,
    error: usersQuery.error,
  };
}
