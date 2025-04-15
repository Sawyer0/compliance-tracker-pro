import { useQuery } from "@tanstack/react-query";
import { useSupabase } from "./useSupabase";
import { fetchDepartmentsWithChecklists } from "../services/checklist";
import { Department } from "@/types/checklist";

/**
 * Interface for raw department data returned from the API
 */
interface ApiDepartment {
  id: string;
  name: string;
  checklists: {
    id: string;
    title: string;
    completed: boolean;
    due_date: string;
    created_at: string;
    notes?: string;
  }[];
}

/**
 * Custom hook to fetch and process department data with their checklists
 * Adds calculated fields like totalTasks, completedTasks, and progress
 * @returns Departments with statistics and loading/error states
 */
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
      const enrichedDepartments = data?.map((dept: ApiDepartment) => {
        const totalTasks = dept.checklists?.length || 0;
        const completedTasks =
          dept.checklists?.filter((task) => task.completed).length || 0;
        const overdueTasks =
          dept.checklists?.filter(
            (task) =>
              !task.completed && new Date(task.due_date) < new Date()
          ).length || 0;

        const progress =
          totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

        // Map API checklists to ChecklistItem type, adding missing department_id
        const mappedChecklists = dept.checklists.map(item => ({
          ...item,
          department_id: dept.id, // Add the department_id from parent
          notes: item.notes || "", // Ensure notes is not undefined
        }));

        return {
          id: dept.id,
          name: dept.name,
          progress,
          totalTasks,
          overdueTasks,
          checklists: mappedChecklists,
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
