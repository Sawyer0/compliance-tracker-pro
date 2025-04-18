import { SupabaseClient } from "@supabase/supabase-js";
import { Tag } from "@/types/checklist";

export async function fetchTags(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase.from("tags").select("*");
    return { data, error };
  } catch (error) {
    console.error("Error fetching tags:", error);
    return { data: null, error };
  }
}

export async function createTag(
  supabase: SupabaseClient,
  tag: Omit<Tag, "id">
) {
  try {
    const { data, error } = await supabase
      .from("tags")
      .insert(tag)
      .select()
      .single();
    return { data, error };
  } catch (error) {
    console.error("Error creating tag:", error);
    return { data: null, error };
  }
}

export async function assignTagsToChecklist(
  supabase: SupabaseClient,
  checklistId: string,
  tagIds: string[]
) {
  try {
    const associations = tagIds.map((tagId) => ({
      checklist_id: checklistId,
      tag_id: tagId,
    }));

    const { data, error } = await supabase
      .from("checklist_tags")
      .insert(associations);

    return { data, error };
  } catch (error) {
    console.error("Error assigning tags:", error);
    return { data: null, error };
  }
}

export async function getChecklistTags(
  supabase: SupabaseClient,
  checklistId: string
) {
  try {
    const { data, error } = await supabase
      .from("checklist_tags")
      .select("tags(*)")
      .eq("checklist_id", checklistId);

    const tags = data?.map((item) => item.tags) || [];

    return { data: tags, error };
  } catch (error) {
    console.error("Error fetching checklist tags:", error);
    return { data: null, error };
  }
}
