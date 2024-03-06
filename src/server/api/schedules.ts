"use server";

// Zod
import { z } from "zod";

// Drizzle
import { and, eq } from "drizzle-orm";

// Ours - DB
import { schedules } from "@/db/schema";
import { db } from "@/db/db";

// Ours - API
import { protectedProcedure, noArgs } from "./shared";

export const all = protectedProcedure(noArgs, async ({ session }) =>
  db
    .select({
      title: schedules.title,
      content: schedules.content,
      id: schedules.id,
    })
    .from(schedules)
    .where(eq(schedules.userId, session.user.id)),
);

export const save = protectedProcedure(
  z.object({
    schedule: z
      .object({
        id: z.number().optional(),
        title: z.string().min(3),
        content: z.string().min(1),
      })
      .strict(),
  }),
  async ({ session, input: { schedule } }) => {
    const userId = session.user.id;
    const scheduleData = {
      title: schedule.title,
      content: schedule.content,
    };

    if (schedule.id !== undefined) {
      await db
        .update(schedules)
        .set(scheduleData)
        .where(
          and(eq(schedules.userId, userId), eq(schedules.id, schedule.id)),
        );

      return schedule.id;
    }

    await db.insert(schedules).values({
      ...scheduleData,
      userId,
    });
  },
);
