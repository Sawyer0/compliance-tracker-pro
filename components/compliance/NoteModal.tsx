import React from "react";
import { useState } from "react";
import { ChecklistItem } from "@/types/checklist";
import { useChecklistStore } from "@/store/checklistStore";
import { useSupabase } from "@/lib/hooks/useSupabase";
import { updateChecklistItem } from "@/lib/services/checklist";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

interface Props {
  item: ChecklistItem;
  onClose: () => void;
  open: boolean;
}

export default function NoteModal({ item, onClose, open }: Props) {
  const [note, setNote] = useState(item.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { updateItem } = useChecklistStore();
  const {
    client: supabase,
    loading: supabaseLoading,
    error: supabaseError,
  } = useSupabase();

  const handleSave = async () => {
    if (!supabase) {
      setError("Cannot connect to database");
      return;
    }

    setLoading(true);
    setError(null);

    const { data, error: apiError } = await updateChecklistItem(
      supabase,
      item.id,
      { notes: note }
    );

    if (apiError) {
      setError("Failed to save note. Please try again.");
    } else if (data) {
      updateItem(data);
      onClose();
    }

    setLoading(false);
  };

  if (supabaseLoading) return <div className="modal-loading">Loading...</div>;
  if (supabaseError)
    return <div className="modal-error">Error: {supabaseError.message}</div>;

  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add a Note</DialogTitle>
        </DialogHeader>

        {error && <p className="modal-error-message">{error}</p>}

        <div className="space-y-4 py-4">
          <textarea
            className="modal-textarea"
            placeholder="Add a note explaining context, decisions, or updates..."
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={5}
          />
        </div>

        <DialogFooter className="modal-footer">
          <Button
            onClick={onClose}
            variant="secondary"
            size="sm"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={loading || note === item.notes}
            size="sm"
          >
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
