"use client";

// React
import { useState } from "react";

// NextJS
import { useRouter } from "next/navigation";

// Ours - Components
import { Popup } from "./Popup";
import { TaskForm } from "./TaskForm";

// Ours - API
import { type APIResponse, api } from "@/server/api";
import type { PersistedTask } from "@/types";

// Ours - Styles
import styles from "./Task.module.css";

type TaskProps = {
  task: PersistedTask;
};

export function Task({ task }: TaskProps) {
  const [showEdit, setShowEdit] = useState(false);
  const router = useRouter();
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  function callWrapper<T>(action: string, fn: () => Promise<APIResponse<T>>) {
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

  const onDelete = callWrapper("deleting task", () =>
    api.tasks.deleteTask({ id: task.id }),
  );
  const markComplete = callWrapper("marking task completed", () =>
    api.tasks.markCompleted({ id: task.id }),
  );

  const steps = task.steps.split("\n").filter((s) => s);

  return (
    <section className={styles["task"]}>
      <div data-task-status={task.status} className={styles["task__title"]}>
        {task.title}
      </div>
      <ol className={styles["task__steps"]}>
        {steps.length > 0
          ? steps.map((step, idx) => (
              <li key={idx} className={styles["task__step"]}>
                {step}
              </li>
            ))
          : ""}
      </ol>
      <div className={styles["action-bar"]}>
        {loading ? (
          "Loading..."
        ) : (
          <>
            {task.repeatable && (
              <button
                className={styles["action-bar__button"]}
                onClick={() => markComplete()}
              >
                Complete
              </button>
            )}
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
