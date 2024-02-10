// Ours - Styles
import styles from "./TasksList.module.css";

export function TasksList({ tasks }) {
  return (
    <section className={styles["tasks-list"]}>
      {tasks.map((task) => (
        <div key={task.id} className={styles["tasks-list__item"]}>
          <div className={styles["task__title"]}>{task.title}</div>
          <div className={styles["goal__title"]}>{task.goal}</div>
          <div className={styles["goal__contributons"]}>
            {task.contributions.map((contribution, idx) => (
              <div key={idx} className={styles["goal__contribution"]}>
                {contribution}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
