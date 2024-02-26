// React
import { Fragment } from "react";

// Ours - Styles
import styles from "./page.module.css";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

type SchedulePageProps = {
  title: string;
  tasks: { id: string; title: string }[];
  addons?: { id: string; title: string }[];
};

export function SchedulePage({ title, tasks, addons }: SchedulePageProps) {
  return (
    <>
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
    </>
  );
}
