import { type tasks } from "@/db/schema";

export enum TaskStatus {
  Pending = "PENDING",
  Completed = "COMPLETED",
}

export type PersistedTask = typeof tasks.$inferSelect & { goal: string };
export type Task = Omit<PersistedTask, "id">;
