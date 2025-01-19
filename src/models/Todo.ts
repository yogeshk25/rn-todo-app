export type Todo = {
  id: string;
  title: string;
  description?: string;
  isCompleted: boolean;
  dueDateTime?: Date;
  isReminder: boolean;
};
