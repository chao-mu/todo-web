"use server";

// Zod
import { z } from "zod";

// Drizzle
import { eq } from "drizzle-orm";

// Ours - DB
import { goals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - API
import { APIError, protectedProcedure, noArgs } from "./shared";

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
