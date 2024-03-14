"use server";

// Zod
import { z } from "zod";

// Drizzle
import { and, count, eq } from "drizzle-orm";

// Ours - DB
import { goalContributions, goals, users } from "@/db/schema";
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
