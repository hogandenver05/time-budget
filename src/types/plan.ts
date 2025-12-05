export type Priority = 'need' | 'want';

export interface PlanEntry {
  categoryId: string;
  label?: string;
  priority: Priority;
  daysOfWeek: number[]; // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  minutesPerDay: number;
  startTimeLocal?: string | null; // Format: "HH:mm" (e.g., "19:00")
  endTimeLocal?: string | null; // Format: "HH:mm" (e.g., "21:00")
  createdAt: Date;
  updatedAt: Date;
}

