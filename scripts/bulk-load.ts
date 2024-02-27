#!/usr/bin/env tsx

import process from "process";
import { tasks, users } from "@/db/schema";
import { db } from "@/db/db";

async function main() {
  const [, , dataPath] = process.argv;
  if (!dataPath) {
    console.error("Expected data path");
    return;
  }

  // Read JSON data
  const data = (await import(dataPath)).default as {
    title: string;
    steps: string;
    status: "PENDING" | "COMPLETED";
    deleted: boolean;
  }[];
  console.log(data);

  const userRes = await db.select({ id: users.id }).from(users);
  if (userRes.length !== 1) {
    throw new Error("Expected 1 user, got " + userRes.length);
  }

  const userId = userRes[0]!.id;

  // Insert tasks
  for (const task of data) {
    await db.insert(tasks).values({
      userId,
      ...task,
    });
  }
}

main();
