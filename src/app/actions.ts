"use server";

// Zod
import { z } from "zod";

// Ours - Models
import { TaskStatus } from "@/models/tasks";

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

export async function saveTask({
  task: taskArg,
}: {
  task: Task;
}): Promise<APIResponse<object>> {
  const result = validateTask(taskArg);
  if ("error" in result) return result;

  return { error: "Not implemented" };

  /*
  const res = await serverSaveTask(result.data);

  if ("error" in res) {
    return res;
  }

  return { data: { id: res.data.id } };
    */
}
