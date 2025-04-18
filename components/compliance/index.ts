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
import CreateTaskModalComponent from "./CreateTaskModal";
import TaskDetailsFormComponent from "./TaskDetailsForm";
import TaskAssignmentFormComponent from "./TaskAssignmentForm";
import TaskTagSelectorComponent from "./TaskTagSelector";
import TaskSummaryComponent from "./TaskSummary";
import TagManagerComponent from "./TagManager";

// Named exports (for destructuring imports)
export const ChecklistItem = ChecklistItemComponent;
export const ChecklistTable = ChecklistTableComponent;
export const NoteModal = NoteModalComponent;
export const CreateTaskModal = CreateTaskModalComponent;
export const TaskDetailsForm = TaskDetailsFormComponent;
export const TaskAssignmentForm = TaskAssignmentFormComponent;
export const TaskTagSelector = TaskTagSelectorComponent;
export const TaskSummary = TaskSummaryComponent;
export const TagManager = TagManagerComponent;

// Default export as an object (for namespace imports)
export default {
  ChecklistItem: ChecklistItemComponent,
  ChecklistTable: ChecklistTableComponent,
  NoteModal: NoteModalComponent,
  CreateTaskModal: CreateTaskModalComponent,
  TaskDetailsForm: TaskDetailsFormComponent,
  TaskAssignmentForm: TaskAssignmentFormComponent,
  TaskTagSelector: TaskTagSelectorComponent,
  TaskSummary: TaskSummaryComponent,
  TagManager: TagManagerComponent,
};
