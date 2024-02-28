// Drizzle
import { eq } from "drizzle-orm";

// Ours - DB
import { tasks } from "@/db/schema";
import { db } from "@/db/db";

export type LegacyTask = {
  title: string;
  contributions: string[];
  goal: string;
  steps: string[];
  status: TaskStatus;
  deleted: boolean;
};

export type PersistedLegacyTask = LegacyTask & {
  id: number;
};

export type Task = {
  title: string;
};

export type GoalContribution = {
  reason: string;
};

export type Goal = {
  title: string;
};

export type Tasks = {
  tasks: Task[];
  goals: Record<number, Goal>;
  goalContributions: Record<number, GoalContribution[]>;
};

export enum TaskStatus {
  Pending = "PENDING",
  Completed = "COMPLETED",
}

export type QueryResult<T> = { data: T } | { error: string };

export async function updateTask(
  id: number,
  values: Partial<LegacyTask>,
): Promise<QueryResult<void>> {
  console.log("Updating task", id, values);
  return { error: "unimplemented" };
}

export async function saveTask(task: LegacyTask): Promise<QueryResult<void>> {
  console.log("Saving task", task);
  return { error: "unimplemented" };
}

export async function deleteTask({
  id,
}: {
  id: number;
}): Promise<QueryResult<void>> {
  console.log("Deleting task", id);
  return { error: "unimplemented" };
}

export async function addTasks(
  tasks: LegacyTask[],
): Promise<QueryResult<void>> {
  console.log("Adding tasks", tasks);
  return { error: "unimplemented" };
}

export async function getTasks(
  userId: string,
): Promise<QueryResult<PersistedLegacyTask[]>> {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.userId, userId))
    .then((rows) =>
      rows.map((task) => ({
        ...task,
        steps: task.steps.split("\n"),
        goal: "unspecified",
        contributions: ["unspecified"],
        status: task.status as TaskStatus,
      })),
    )
    .then((tasks) => ({ data: tasks }));
}
