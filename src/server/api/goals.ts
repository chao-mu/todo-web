"use server";

// Zod
import { z } from "zod";

// Drizzle
import { and, count, eq } from "drizzle-orm";

// Ours - DB
import { goalContributions, goals, tasks, tasksGoals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - API
import { protectedProcedure, noArgs } from "./shared";

export const saveByTitle = protectedProcedure(
  z.object({ title: z.string() }),
  async ({ session, input: { title } }): Promise<{ id: number }> => {
    const userId = session.user.id;
    await db.insert(goals).values({ userId, title }).onConflictDoNothing();
    const res = await db
      .select({ id: goals.id })
      .from(goals)
      .where(eq(goals.title, title));
    if (!res[0]) {
      throw { error: "Id not found for newly inserted goal" };
    }

    return res[0];
  },
);

export const progress = protectedProcedure(noArgs, async ({ session }) => {
  const userId = session.user.id;

  const progressRows = await db
    .select({
      goal: goals.title,
      taskStatus: tasks.status,
      points: count(goalContributions.id),
      total: count(tasks.id),
    })
    .from(goals)
    .leftJoin(goalContributions, eq(goalContributions.goalId, goals.id))
    .innerJoin(tasksGoals, eq(tasksGoals.goalId, goals.id))
    .innerJoin(tasks, eq(tasks.id, tasksGoals.taskId))
    .where(and(eq(goals.userId, userId), eq(tasks.deleted, false)))
    .groupBy(goals.title, tasks.status);

  return progressRows.reduce(
    (acc, { goal, taskStatus, points, total }) => {
      const progress = acc[goal] ?? {
        total: 0,
        completed: 0,
        points: 0,
      };

      progress.points += points;
      progress.total += total;
      if (taskStatus == "COMPLETED") {
        progress.completed += total;
      }

      return {
        ...acc,
        [goal]: progress,
      };
    },
    {} as Record<string, { total: number; completed: number; points: number }>,
  );
});

export const all = protectedProcedure(noArgs, async ({ session }) => {
  const userId = session.user.id;

  return db
    .select({ title: goals.title, id: goals.id })
    .from(goals)
    .where(eq(goals.userId, userId));
});

export const contributions = protectedProcedure(noArgs, async ({ session }) => {
  const userId = session.user.id;

  return db
    .select({ title: goals.title, goalId: goals.id, count: count() })
    .from(goalContributions)
    .innerJoin(goals, eq(goals.id, goalContributions.goalId))
    .where(eq(goals.userId, userId))
    .groupBy(goals.title, goals.id);
});
