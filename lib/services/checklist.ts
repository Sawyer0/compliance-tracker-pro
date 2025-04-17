import { SupabaseClient } from "@supabase/supabase-js";
import { ChecklistItem } from "@/types/checklist";

export async function fetchChecklists(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase.from("checklists").select("*");

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return { data: null, error };
  }
}

export async function createChecklistItem(
  supabase: SupabaseClient,
  item: ChecklistItem
) {
  try {
    const { data, error } = await supabase
      .from("checklists")
      .insert(item)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return { data: null, error };
  }
}

export async function updateChecklistItem(
  supabase: SupabaseClient,
  id: string,
  updates: Partial<ChecklistItem>
) {
  try {
    const { data, error } = await supabase
      .from("checklists")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      return { data: null, error };
    }

    return { data, error: null };
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return { data: null, error };
  }
}

export async function fetchDepartmentsWithChecklists(
  supabase: SupabaseClient,
  userId: string
) {
  try {
    const { data: userDepartments, error: userDeptError } = await supabase
      .from("user_departments")
      .select("department_id")
      .eq("user_id", userId);

    if (userDeptError || !userDepartments?.length) {
      return { data: [], error: userDeptError };
    }

    const departmentIds = userDepartments.map((d) => d.department_id);

    const { data: departments, error: deptError } = await supabase
      .from("departments")
      .select(
        `
        id, 
        name,
        checklists (
          id,
          title,
          completed,
          due_date,
          created_at,
          notes
        )
      `
      )
      .in("id", departmentIds);

    if (deptError) {
      return { data: null, error: deptError };
    }

    return { data: departments || [], error: null };
  } catch (error) {
    console.error("Error fetching departments with checklists:", error);
    return { data: null, error };
  }
}
