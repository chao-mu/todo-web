// Drizzle
import { eq } from "drizzle-orm";

// Ours - DB
import { goals } from "@/db/schema";
import { db } from "@/db/db";

// Ours - Model
import { type QueryResult } from "./tasks";

export type PersistedGoal = typeof goals.$inferSelect;
export type Goal = Omit<PersistedGoal, "id">;

export async function getGoals(userId: string): Promise<PersistedGoal[]> {
  return db.select().from(goals).where(eq(goals.userId, userId));
}

export async function saveGoal(
  goal: Goal | PersistedGoal,
): Promise<QueryResult<{ id: number }>> {
  if ("id" in goal) {
    try {
      await db.update(goals).set(goal).where(eq(goals.id, goal.id));
    } catch (e) {
      return { error: `Failed to update goal` };
    }

    return { data: { id: goal.id } };
  }

  let res;
  try {
    res = await db.insert(goals).values(goal).returning({ id: goals.id });
  } catch (e) {}

  if (!res?.[0]) {
    return { error: `Failed to create goal` };
  }

  return { data: res[0] };
}
