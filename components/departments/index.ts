/**
 * Department Components
 *
 * This file exports all components related to department management
 * for easier imports throughout the application.
 */

// Export both default and named exports for flexibility
import CreateDepartmentModalComponent from "./CreateDepartmentModal";

// Named exports (for destructuring imports)
export const CreateDepartmentModal = CreateDepartmentModalComponent;

// Default export as an object (for namespace imports)
export default {
  CreateDepartmentModal: CreateDepartmentModalComponent,
};
