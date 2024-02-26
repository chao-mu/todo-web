// Ours - Components
import { TaskForm } from "@/components/TaskForm";

// Ours - Styles
import styles from "./page.module.css";

export default function Page() {
  return (
    <section className={styles["page"]}>
      <h1>New Task</h1>
      <TaskForm />
    </section>
  );
}
