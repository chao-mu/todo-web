// Ours - Styles
import styles from "./page.module.css";

// Ours - API
import { api } from "@/server/api";

// Ours - Types
import { TaskStatus } from "@/types";

// Ours - Components
import { Progress } from "@/components/Progress";

type GoalProgress = {
  total: number;
  completed: number;
};

type GoalProgressLookup = Record<string, GoalProgress>;
export default async function Page() {
  const tasksRes = await api.tasks.all({});
  if ("error" in tasksRes) {
    throw new Error(`Unable to retrieve tasks: ${tasksRes.error}`);
  }

  const tasks = tasksRes.data;

  const progressByGoal: GoalProgressLookup = tasks.reduce(
    (acc, { goal, status, deleted }) => {
      if (deleted) {
        return acc;
      }

      const progress = acc[goal] ?? { total: 0, completed: 0 };

      progress.total += 1;
      if (status === TaskStatus.Completed) {
        progress.completed += 1;
      }

      return {
        ...acc,
        [goal]: progress,
      };
    },
    {} as GoalProgressLookup,
  );

  return (
    <>
      <section className={styles["hero"]}>
        <h1>Welcome!</h1>
        <p>Best of luck on your tasks, my friend.</p>
      </section>
      <section className={styles["progress-section"]}>
        <h2>Progress</h2>
        <div className={styles["goals"]}>
          {Object.entries(progressByGoal).map(
            ([goal, { total, completed }]) => (
              <>
                <div key={`title_${goal}`} className={styles["goal__title"]}>
                  {goal}
                </div>
                <div
                  key={`progress_${goal}`}
                  className={styles["goal__progress"]}
                >
                  <Progress current={completed} total={total} />
                </div>
              </>
            ),
          )}
        </div>
      </section>
    </>
  );
}
