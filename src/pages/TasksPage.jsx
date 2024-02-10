// React
import { Fragment } from "react";

// Ours - Styles
import styles from "./TasksPage.module.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function TasksPage({ title, tasks, addons }) {
  return (
    <main className={styles["page"]}>
      <h1>{title}</h1>
      {days.map((day) => (
        <div className={styles["header"]} key={day}>
          {day}
        </div>
      ))}
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <div className={styles["daily"]}>{task.title}</div>
          {days.map((day) => (
            <div key={day} className={styles["box"]} />
          ))}
        </Fragment>
      ))}
      {addons && (
        <div className={styles["addons"]}>
          {addons.map((task) => (
            <div key={task.id} className={styles["addon"]}>
              <div className={styles["box"]} />
              {task.title}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
