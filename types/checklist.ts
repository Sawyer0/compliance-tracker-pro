export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  department_id: string;
  notes: string;
  created_at: string;
  due_date: string;
}

export interface Department {
  id: string;
  name: string;
  progress: number;
  checklists: ChecklistItem[];
}

export type UserRole = "admin" | "user";
