// Ours - Components
import { Task } from "./Task";

import type { PersistedLegacyTask } from "@/models/tasks";

// Ours - Styles
import styles from "./TasksList.module.css";

export type TasksListProps = {
  tasks: PersistedLegacyTask[];
};

export function TasksList({ tasks }: TasksListProps) {
  return (
    <section className={styles["tasks-list"]}>
      {tasks.map((task) => (
        <Task key={task.id} task={task} />
      ))}
    </section>
  );
}
