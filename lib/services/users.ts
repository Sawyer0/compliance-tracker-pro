import { SupabaseClient } from "@supabase/supabase-js";

export interface DepartmentUser {
  id: string;
  full_name: string;
  email?: string;
  role: string;
  department_id: string;
  department_name?: string;
}

/**
 * Fetches users associated with a specific department
 * @param supabase Supabase client
 * @param departmentId Department ID to fetch users for
 * @returns Users associated with the department
 */
export async function fetchDepartmentUsers(
  supabase: SupabaseClient,
  departmentId: string
) {
  try {
    const { data, error } = await supabase
      .from("user_departments")
      .select(
        `
        user_id,
        department_id,
        role,
        profiles:user_id (id, full_name, email),
        departments:department_id (name)
      `
      )
      .eq("department_id", departmentId);

    if (error) {
      return { data: null, error };
    }

    const users = data.map((item: any) => ({
      id: item.profiles.id,
      full_name: item.profiles.full_name,
      email: item.profiles.email,
      role: item.role,
      department_id: item.department_id,
      department_name: item.departments.name,
    })) as DepartmentUser[];

    return { data: users, error: null };
  } catch (error) {
    console.error("Error fetching department users:", error);
    return { data: null, error };
  }
}

/**
 * Fetches all users in the system
 * @param supabase Supabase client
 * @returns All users
 */
export async function fetchAllUsers(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, full_name, email, role");

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { data: null, error };
  }
}
