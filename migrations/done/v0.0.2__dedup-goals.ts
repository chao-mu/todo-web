import { Firestore, WriteBatch } from "@google-cloud/firestore";

export default async (db: Firestore) => {
  const authorativeGoalRef = {};

  const users = await db.collection("users").listDocuments();
  users.forEach(async (user) => {
    const goals = await user.collection("goals").get();
    goals.forEach(async (goal) => {
      const { title } = goal.data();
      authorativeGoalRef[title] = goal.ref;
    });

    const tasks = await user.collection("tasks").get();
    tasks.forEach(async (task) => {
      const contributions = await task.ref.collection("contributions").get();

      contributions.forEach(async (contribution) => {
        const { goal } = contribution.data();
        const goalDoc = await goal.get();
        if (!goalDoc.exists) {
          return;
        }

        const { title } = goalDoc.data();
        const goalRef = authorativeGoalRef[title];

        contribution.ref.update({ goalRef, goal: null });
      });
    });

    goals.forEach(async (goal) => {
      const { title } = goal.data();
      const { id } = goal;
      const authority = authorativeGoalRef[title];
      if (authority.id !== id) {
        console.log("deleting", id);
        //await goal.ref.delete();
      }
    });
  });
};
