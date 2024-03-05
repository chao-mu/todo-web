"use server";

// Zod
import { z } from "zod";

// Drizzle
import { eq } from "drizzle-orm";

// Ours - DB
import { goals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - API
import { protectedProcedure } from "./shared";

export const saveByTitle = protectedProcedure(
  z.object({ title: z.string() }),
  async ({ session, input: { title } }) => {
    const userId = session.user.id;
    await db.insert(goals).values({ userId, title }).onConflictDoNothing();
    const res = await db
      .select({ id: goals.id })
      .from(goals)
      .where(eq(goals.title, title));
    if (!res[0]) {
      return { error: "Id not found for newly inserted goal" };
    }

    return { id: res[0] };
  },
);
