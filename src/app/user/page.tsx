// Ours - Styles
import styles from "./page.module.css";

// Ours - API
import { api } from "@/server/api";

// Ours - Components
import { Progress } from "@/components/Progress";

type GoalProgress = {
  total: number;
  completed: number;
  points: number;
};

type GoalProgressLookup = Record<string, GoalProgress>;
export default async function Page() {
  const res = await api.goals.progress({});
  if ("error" in res) {
    throw new Error(`Unable to retrieve goal progress: ${res.error}`);
  }

  const progressByGoal: GoalProgressLookup = res.data;

  return (
    <>
      <section className={styles["hero"]}>
        <h1>Welcome!</h1>
        <p>Best of luck on your tasks, my friend.</p>
      </section>
      <section className={styles["progress-section"]}>
        <div className={styles["goals"]}>
          {Object.entries(progressByGoal).map(
            ([goal, { total, completed, points }]) => (
              <>
                <div key={`title_${goal}`} className={styles["goals__title"]}>
                  {goal}
                </div>
                <div
                  key={`progress_${goal}`}
                  className={styles["goals__progress"]}
                >
                  <Progress current={completed} what="tasks" total={total} />
                </div>
                <div className={styles["goals__points"]}>
                  Bonus Points: {points}
                </div>
              </>
            ),
          )}
        </div>
      </section>
    </>
  );
}
