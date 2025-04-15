import React, { useState } from "react";
import { ChecklistItem as ItemType } from "@/types/checklist";
import { useChecklistStore } from "@/store/checklistStore";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { updateChecklistItem } from "@/lib/services/checklist";
import NoteModal from "./NoteModal";
import { Button } from "@/components/ui/button";

interface Props {
  item: ItemType;
}

export default function ChecklistItem({ item }: Props) {
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const { updateItem } = useChecklistStore();
  const {
    client: supabase,
    loading: supabaseLoading,
    error: supabaseError,
  } = useSupabase();

  const onStatusChange = async () => {
    if (!supabase) return;
    setLoading(true);
    const { data, error } = await updateChecklistItem(supabase, item.id, {
      completed: !item.completed,
    });

    if (data) updateItem(data);
    if (error) console.error("Error updating checklist item:", error);
    setLoading(false);
  };

  if (supabaseLoading) return <div>Loading...</div>;
  if (supabaseError) return <div>Error: {supabaseError.message}</div>;

  return (
    <li className="checklist-item">
      <div>
        <p className="item-title">{item.title}</p>
        <p className="item-status">
          Status: {item.completed ? "Completed" : "Pending"}
        </p>
        {item.notes && <p className="item-note">{item.notes}</p>}
      </div>
      <div className="flex gap-2 items-center">
        <Button
          onClick={onStatusChange}
          disabled={loading}
          variant={item.completed ? "destructive" : "default"}
          size="sm"
        >
          {item.completed ? "Mark Incomplete" : "Mark Complete"}
        </Button>
        <Button
          onClick={() => setShowNoteModal(true)}
          variant="secondary"
          size="sm"
        >
          Add Note
        </Button>
      </div>
      <NoteModal
        item={item}
        onClose={() => setShowNoteModal(false)}
        open={showNoteModal}
      />
    </li>
  );
}
