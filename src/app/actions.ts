"use server";

// Zod
import { z } from "zod";

// Ours - Models
import { insertTask, updateTask, TaskStatus } from "@/server/models/tasks";

import { addGoalToTask, saveGoal } from "@/server/models/goals";

export { TaskStatus };

const TaskSchema = z
  .object({
    id: z.number().optional(),
    title: z.string(),
    description: z.string(),
    goal: z.string(),
    steps: z.string(),
    contributions: z.array(z.string()),
    status: z.enum([TaskStatus.Pending, TaskStatus.Completed]),
    deleted: z.boolean().optional(),
  })
  .strict();

export type Task = z.infer<typeof TaskSchema>;
export type PersistedTask = Task & { id: number };

export type APIResponse<T> = { data: T } | { error: string };

function validateTask(task: Task): { data: Task } | { error: string } {
  const result = TaskSchema.safeParse(task);
  if (!result.success) {
    return { error: `Invalid task: ${result.error.message}` };
  }

  return { data: result.data };
}

export async function markTaskCompleted({
  id,
}: {
  id: number;
}): Promise<APIResponse<object>> {
  return { error: `Not implemented. ${id}` };
}

export async function deleteTask({
  id,
}: {
  id: number;
}): Promise<APIResponse<object>> {
  return { error: `Not implemented. ${id}` };
}

export async function getTasks(): Promise<APIResponse<PersistedTask[]>> {
  //const session = await getAuthenticatedSession();

  return { error: "Not implemented" };
}

export async function saveTask({
  task: taskArg,
}: {
  task: Task;
}): Promise<APIResponse<object>> {
  const result = validateTask(taskArg);
  if ("error" in result) return result;

  /*
  const task = result.data;

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

  const goalId = goalSaveResult.data.id;

  const goalAddResult = await addGoalToTask({ goalId, taskId: res.data.id });

  if ("error" in goalAddResult) {
    return { error: `Failed to add goal to task: ${goalAddResult.error}` };
  }
*/

  return { error: "Not implemented" };
}
