import { Firestore, WriteBatch } from "@google-cloud/firestore";

export default async (db: Firestore) => {
  console.log("Decoupling goals...");
  const users = await db.collection("users").listDocuments();
  users.forEach(async (user) => {
    const tasks = await user.collection("tasks").get();
    tasks.forEach(async (task) => {
      const { goal, contributions } = task.data();

      const goalDoc = await user.collection("goals").add({ title: goal });

      contributions.forEach(async (contribution: string) => {
        task.ref.collection("contributions").add({
          contribution,
          goal: goalDoc,
        });
      });

      task.ref.update({ goal: null, contributions: null, goals: [goalDoc] });
    });
  });
};
