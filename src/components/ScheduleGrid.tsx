"use client";

// React
import { Fragment } from "react";

// Ours - Styles
import styles from "./ScheduleGrid.module.css";

const days = ["Thu", "Fri", "Sat", "Sun", "Mon", "Tue", "Wed"];

type ScheduleGridProps = {
  title: string;
  content: string;
};

export function ScheduleGrid({ title, content }: ScheduleGridProps) {
  const tasks = content.trim().split("\n");

  return (
    <section className={styles["schedule"]}>
      <h1>{title}</h1>
      {days.map((day) => (
        <div className={styles["header"]} key={day}>
          {day}
        </div>
      ))}
      {tasks.map((task) => (
        <Fragment key={task}>
          <div className={styles["daily"]}>{task}</div>
          {days.map((day) => (
            <div key={day} className={styles["box"]} />
          ))}
        </Fragment>
      ))}
    </section>
  );
}
