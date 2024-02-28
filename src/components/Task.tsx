"use client";

// React
import { useState } from "react";

// NextJS
import { useRouter } from "next/navigation";

// Ours - Components
import { Popup } from "./Popup";
import { TaskForm } from "./TaskForm";

// Ours - Model
import { deleteTask, updateTask, TaskStatus } from "@/models/tasks";
import type { PersistedLegacyTask, QueryResult } from "@/models/tasks";

// Ours - Styles
import styles from "./Task.module.css";

type TaskProps = {
  task: PersistedLegacyTask;
};

export function Task({ task }: TaskProps) {
  const [showEdit, setShowEdit] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function callWrapper<T>(action: string, fn: () => Promise<QueryResult<T>>) {
    return async () => {
      setLoading(true);

      const result = await fn();
      if ("error" in result) {
        setError(`Error ${action}: ${error}`);
      } else {
        router.refresh();
      }

      setLoading(false);
    };
  }

  const onDelete = callWrapper("deleting task", () => deleteTask(task));
  const markComplete = callWrapper("marking task completed", () =>
    updateTask(task.id, { status: TaskStatus.Completed }),
  );

  return (
    <section className={styles["task"]}>
      <div data-task-status={task.status} className={styles["task__title"]}>
        {task.title}
      </div>
      <div className={styles["goal__title"]}>{task.goal}</div>
      <ul className={styles["goal__contributions"]}>
        {task.contributions.map((contribution, idx) => (
          <li key={idx} className={styles["goal__contribution"]}>
            {contribution}
          </li>
        ))}
      </ul>
      <ol className={styles["task__steps"]}>
        {task.steps?.map((step, idx) => (
          <li key={idx} className={styles["task__step"]}>
            {step}
          </li>
        ))}
      </ol>
      <div className={styles["action-bar"]}>
        {loading ? (
          "Loading..."
        ) : (
          <>
            <button
              className={styles["action-bar__button"]}
              onClick={() => markComplete()}
            >
              Complete
            </button>
            <button
              className={styles["action-bar__button"]}
              onClick={() => setShowEdit(true)}
            >
              Edit
            </button>
            <button
              className={styles["action-bar__button"]}
              onClick={() => onDelete()}
            >
              Delete
            </button>
          </>
        )}
      </div>
      <div className={styles["error"]}>{error}</div>
      <Popup show={showEdit}>
        <TaskForm
          task={task}
          onSuccess={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Popup>
    </section>
  );
}
