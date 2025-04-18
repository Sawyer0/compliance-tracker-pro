import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Fetch all departments from the database
 * @param supabase Supabase client
 * @returns Departments data or error
 */
export async function fetchAllDepartments(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase.from("departments").select("*");

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching departments:", error);
    return { data: null, error };
  }
}

/**
 * Create a new department
 * @param supabase Supabase client
 * @param department Department data to create
 * @returns Created department data or error
 */
export async function createDepartment(
  supabase: SupabaseClient,
  department: { name: string; description?: string }
) {
  try {
    // Create a new object with just the name to avoid description column errors
    const departmentData = { name: department.name };

    const { data, error } = await supabase
      .from("departments")
      .insert(departmentData)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating department:", error);
    return { data: null, error };
  }
}

/**
 * Update an existing department
 * @param supabase Supabase client
 * @param id Department ID
 * @param updates Department data to update
 * @returns Updated department data or error
 */
export async function updateDepartment(
  supabase: SupabaseClient,
  id: string,
  updates: { name?: string; description?: string }
) {
  try {
    // Only include name in the updates to avoid description column errors
    const updateData = { name: updates.name };

    const { data, error } = await supabase
      .from("departments")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error updating department:", error);
    return { data: null, error };
  }
}

/**
 * Delete a department
 * @param supabase Supabase client
 * @param id Department ID
 * @returns Success status or error
 */
export async function deleteDepartment(supabase: SupabaseClient, id: string) {
  try {
    // Check if department has associated checklists
    const { count, error: countError } = await supabase
      .from("checklists")
      .select("*", { count: "exact", head: true })
      .eq("department_id", id);

    if (countError) {
      return { success: false, error: countError };
    }

    if (count && count > 0) {
      return {
        success: false,
        error: new Error(
          `Cannot delete department with ${count} associated checklist items`
        ),
      };
    }

    // Remove user associations first
    await supabase.from("user_departments").delete().eq("department_id", id);

    // Then delete the department
    const { error } = await supabase.from("departments").delete().eq("id", id);

    if (error) {
      return { success: false, error };
    }

    return { success: true, error: null };
  } catch (error) {
    console.error("Error deleting department:", error);
    return { success: false, error };
  }
}

/**
 * Assign a user to a department
 * @param supabase Supabase client
 * @param userId User ID
 * @param departmentId Department ID
 * @param role User role in the department
 * @returns Success status or error
 */
export async function assignUserToDepartment(
  supabase: SupabaseClient,
  userId: string,
  departmentId: string,
  role: "owner" | "editor" | "viewer" = "viewer"
) {
  try {
    const { data, error } = await supabase
      .from("user_departments")
      .insert({
        user_id: userId,
        department_id: departmentId,
        role,
      })
      .select()
      .single();

    if (error) {
      return { success: false, error };
    }

    return { success: true, data, error: null };
  } catch (error) {
    console.error("Error assigning user to department:", error);
    return { success: false, error };
  }
}
