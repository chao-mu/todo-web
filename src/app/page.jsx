// Hours - Hooks
import { useAppData } from "@/hooks";

// Ours - Styles
import styles from "./page.module.css";

// Ours - DB
import { TaskStatus } from "@/db";

// Ours - Components
import { Progress } from "@/components/Progress";

export default function Page() {
  const { tasks } = useAppData();

  const progressByGoal = tasks.reduce((acc, { goal, status, deleted }) => {
    if (deleted) {
      return acc;
    }

    const progress = acc[goal] || { total: 0, completed: 0 };

    progress.total += 1;
    if (status === TaskStatus.COMPLETED) {
      progress.completed += 1;
    }

    return {
      ...acc,
      [goal]: progress,
    };
  }, {});

  console.log(tasks);

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
            )
          )}
        </div>
      </section>
    </>
  );
}
