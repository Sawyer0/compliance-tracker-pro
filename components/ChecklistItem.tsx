"use client";

import React, { useState } from "react";
import { ChecklistItem as ItemType } from "@/types/checklist";
import { getSupabaseClient } from "@/lib/getSupabaseClient";
import { useChecklistStore } from "@/store/checklistStore";
// import NoteModal from "./NoteModal";

interface Props {
  item: ItemType;
}

export default function ChecklistItem({ item }: Props) {
  const [loading, setLoading] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const { updateItem } = useChecklistStore();

  const onStatusChange = async () => {
    setLoading(true);
    const res = await fetch("/api/supabase-token");
    const { token } = await res.json();
    const supabase = getSupabaseClient(token);
    const { data } = await supabase
      .from("checklists")
      .update({ completed: !item.completed })
      .eq("id", item.id)
      .select()
      .single();

    if (data) updateItem(data);
    setLoading(false);
  };

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
        <button
          onClick={onStatusChange}
          disabled={loading}
          className="btn-action"
        >
          {item.completed ? "Mark Incomplete" : "Mark Complete"}
        </button>
        <button
          onClick={() => setShowNoteModal(true)}
          className="btn-secondary"
        >
          Add Note
        </button>
      </div>
      {/* <NoteModal item={item} onClose={() => setShowNoteModal(false)} /> */}
      {/* {showNoteModal && <NoteModal item={item} onClose={() => setShowNoteModal(false)} />}  */}
    </li>
  );
}
