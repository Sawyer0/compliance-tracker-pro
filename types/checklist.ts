export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  department_id: string;
  notes: string;
  created_at: string;
  due_date: string;
  assigned_to?: string;
}

export interface Department {
  id: string;
  name: string;
  progress: number;
  totalTasks?: number;
  overdueTasks?: number;
  checklists: ChecklistItem[];
}

export interface User {
  id: string;
  full_name: string;
  email?: string;
  role: "admin" | "user";
}

export interface UserDepartmentAssignment {
  user_id: string;
  department_id: string;
  role: "owner" | "editor" | "viewer";
}

export type UserRole = "admin" | "user";
