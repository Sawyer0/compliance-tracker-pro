import { SupabaseClient } from '@supabase/supabase-js';
import { ChecklistItem } from '@/types/checklist';

export async function fetchChecklists(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from('checklists')
      .select('*');
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching checklists:', error);
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
      .from('checklists')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error updating checklist item:', error);
    return { data: null, error };
  }
}

export async function fetchDepartmentsWithChecklists(supabase: SupabaseClient) {
  try {
    const { data, error } = await supabase
      .from('departments')
      .select(`
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
      `);
      
    if (error) {
      throw error;
    }
    
    return { data, error: null };
  } catch (error) {
    console.error('Error fetching departments with checklists:', error);
    return { data: null, error };
  }
} 