/**
 * Compliance Feature Components
 *
 * This file exports all components related to the compliance tracking feature
 * for easier imports throughout the application.
 */

// Export both default and named exports for flexibility
import ChecklistItemComponent from "./ChecklistItem";
import ChecklistTableComponent from "./ChecklistTable";
import NoteModalComponent from "./NoteModal";

// Named exports (for destructuring imports)
export const ChecklistItem = ChecklistItemComponent;
export const ChecklistTable = ChecklistTableComponent;
export const NoteModal = NoteModalComponent;

// Default export as an object (for namespace imports)
export default {
  ChecklistItem: ChecklistItemComponent,
  ChecklistTable: ChecklistTableComponent,
  NoteModal: NoteModalComponent,
};
