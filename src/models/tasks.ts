// Drizzle
import { eq } from "drizzle-orm";

// Ours - DB
import { tasks, tasksGoals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - Model
import { saveGoal } from "./goals";

export type LegacyTask = {
  title: string;
  contributions: string[];
  goal: string;
  steps: string[];
  status: TaskStatus;
  deleted: boolean;
  userId: string;
};

export type PersistedLegacyTask = LegacyTask & {
  id: number;
};

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

async function insertTask(
  task: LegacyTask,
): Promise<QueryResult<{ id: number }>> {
  let res;
  try {
    res = await db
      .insert(tasks)
      .values({ ...task, ...legacyShim(task) })
      .returning({ id: tasks.id });
  } catch (e) {}

  if (!res?.[0]) {
    return { error: `Failed to create task` };
  }

  return { data: res[0] };
}

const legacyShim = (task: LegacyTask) => ({
  steps: task.steps.join("\n"),
});

async function updateTask(
  task: PersistedLegacyTask,
): Promise<QueryResult<{ id: number }>> {
  try {
    await db
      .update(tasks)
      .set({ ...task, ...legacyShim(task) })
      .where(eq(tasks.id, task.id));
  } catch (e) {
    return { error: `Failed to update task` };
  }

  return { data: { id: task.id } };
}

export async function saveTask(
  task: LegacyTask | PersistedLegacyTask,
): Promise<QueryResult<void>> {
  const res = await ("id" in task ? updateTask(task) : insertTask(task));
  if ("error" in res) {
    return res;
  }

  const goalSaveResult = await saveGoal({
    userId: task.userId,
    title: task.goal,
    deleted: false,
  });

  if ("error" in goalSaveResult) {
    return { error: `Failed to save goal for task: ${goalSaveResult.error}` };
  }

  await db
    .insert(tasksGoals)
    .values({
      taskId: res.data.id,
      goalId: goalSaveResult.data.id,
    })
    .onConflictDoNothing();

  return { data: undefined };
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
