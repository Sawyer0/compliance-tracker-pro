import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import { fetchDepartmentsWithChecklists } from "../services/checklist";
import { Department } from "@/types/checklist";

export function useDepartments() {
  const { client } = useSupabase();

  // Fetch departments with their checklists
  const departmentsQuery = useQuery({
    queryKey: ["departments"],
    queryFn: async () => {
      if (!client) throw new Error("Supabase client not initialized");

      const { data, error } = await fetchDepartmentsWithChecklists(client);
      if (error) throw error;

      // Calculate statistics for each department
      const enrichedDepartments = data?.map((dept: any) => {
        const totalTasks = dept.checklists?.length || 0;
        const completedTasks =
          dept.checklists?.filter((task: any) => task.completed).length || 0;
        const overdueTasks =
          dept.checklists?.filter(
            (task: any) =>
              !task.completed && new Date(task.due_date) < new Date()
          ).length || 0;

        const progress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        return {
          ...dept,
          totalTasks,
          overdueTasks,
          progress,
        } as Department;
      });

      return enrichedDepartments || [];
    },
    enabled: !!client, // Only run the query when the Supabase client is available
  });

  return {
    departments: departmentsQuery.data || [],
    isLoading: departmentsQuery.isLoading,
    isError: departmentsQuery.isError,
    error: departmentsQuery.error,
  };
}
