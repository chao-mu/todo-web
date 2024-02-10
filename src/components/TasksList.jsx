// Ours - Components
import { Task } from "./Task";

// Ours - Styles
import styles from "./TasksList.module.css";

export function TasksList({ tasks }) {
  return (
    <section className={styles["tasks-list"]}>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </section>
  );
}
