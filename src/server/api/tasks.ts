"use server";

// Zod
import { z } from "zod";

// Drizzle
import { and, eq } from "drizzle-orm";

// Ours - DB
import { goals, tasks, tasksGoals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - API
import { protectedProcedure, noArgs, isAPIError } from "./shared";
import * as goalsAPI from "./goals";
import { TaskStatus } from "@/types";

export const all = protectedProcedure(noArgs, async ({ session }) => {
  const userId = session.user.id;

  return db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      steps: tasks.steps,
      userId: tasks.userId,
      deleted: tasks.deleted,
      repeatable: tasks.repeatable,
      goal: goals.title,
    })
    .from(tasks)
    .leftJoin(tasksGoals, eq(tasksGoals.taskId, tasks.id))
    .leftJoin(goals, eq(goals.id, tasksGoals.goalId))
    .where(and(eq(tasks.userId, userId)))
    .then((rows) =>
      rows.map((row) => ({
        ...row,
        goal: row.goal ?? "unspecified",
      })),
    );
});

export const markCompleted = protectedProcedure(
  z.object({ id: z.number() }),
  async ({ session, input: { id } }) =>
    db
      .update(tasks)
      .set({ status: TaskStatus.Completed })
      .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
      .then(() => true),
);

export const save = protectedProcedure(
  z.object({
    task: z
      .object({
        id: z.number().optional(),
        title: z.string(),
        goal: z.string(),
        steps: z.string(),
        repeatable: z.boolean(),
      })
      .strict(),
  }),
  async ({ session, input: { task } }): Promise<{ id: number }> => {
    const userId = session.user.id;

    const taskValues = {
      title: task.title,
      steps: task.steps,
      repeatable: task.repeatable,
    };

    if (task.id) {
      await db
        .update(tasks)
        .set(taskValues)
        .where(and(eq(tasks.id, task.id), eq(tasks.userId, userId)));
    } else {
      const res = await db
        .insert(tasks)
        .values({
          ...taskValues,
          userId,
        })
        .returning({ id: tasks.id });

      if (!res?.[0]) {
        throw {
          error: "Database did not respond with id when inserting task",
        };
      }

      task.id = res[0].id;
    }

    const goalSaveRes = await goalsAPI.saveByTitle({ title: task.goal });
    if (isAPIError(goalSaveRes)) {
      throw goalSaveRes;
    }

    await addGoal({ taskId: task.id, goalId: goalSaveRes.data.id });

    return { id: task.id };
  },
);

export const deleteTask = protectedProcedure(
  z.object({ id: z.number() }),
  async ({ session, input: { id } }) =>
    db
      .delete(tasks)
      .where(and(eq(tasks.id, id), eq(tasks.userId, session.user.id)))
      .then(() => true),
);

export const addGoal = protectedProcedure(
  z.object({
    taskId: z.number(),
    goalId: z.number(),
  }),
  async ({ input: { taskId, goalId } }) =>
    db
      .insert(tasksGoals)
      .values({
        taskId,
        goalId,
      })
      .onConflictDoNothing(),
);
