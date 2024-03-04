// Drizzle
import { eq } from "drizzle-orm";

// Ours - DB
import { tasks, tasksGoals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - Model
import { saveGoal } from "./goals";

export type PersistedTask = typeof tasks.$inferSelect;
export type Task = Omit<PersistedTask, "id">;

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

export async function insertTask(
  task: Task,
): Promise<QueryResult<{ id: number }>> {
  let res;
  try {
    res = await db.insert(tasks).values(task).returning({ id: tasks.id });
  } catch (e) {}

  if (!res?.[0]) {
    return { error: `Failed to create task` };
  }

  return { data: res[0] };
}

export async function updateTask(
  task: PersistedTask,
): Promise<QueryResult<{ id: number }>> {
  try {
    await db.update(tasks).set(task).where(eq(tasks.id, task.id));
  } catch (e) {
    return { error: `Failed to update task` };
  }

  return { data: { id: task.id } };
}

export async function deleteTask({
  id,
}: {
  id: number;
}): Promise<QueryResult<void>> {
  console.log("Deleting task", id);
  return { error: "unimplemented" };
}

export async function addTasks(tasks: Task[]): Promise<QueryResult<void>> {
  console.log("Adding tasks", tasks);
  return { error: "unimplemented" };
}

export async function getTasks(
  userId: string,
): Promise<QueryResult<PersistedTask[]>> {
  try {
    const data = await db.select().from(tasks).where(eq(tasks.userId, userId));

    return { data };
  } catch (e) {
    return { error: `Failed to get tasks` };
  }
}
