
export interface Task {
  id: string;
  title: string;
  description?: string;
  category: 'work' | 'personal' | 'shopping' | 'health' | 'other';
  priority: 'low' | 'medium' | 'high';
  completed: boolean;
  dueDate?: string;
  createdAt: string;
}

export type TaskCategory = Task['category'];
export type TaskPriority = Task['priority'];
