export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  department_id: string;
  notes: string;
  created_at: string;
}

export interface Department {
  id: string;
  name: string;
  progress: number;
}

export type UserRole = "admin" | "user";
