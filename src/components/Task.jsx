// React
import { useState } from "react";

// React Router
import { useRevalidator } from "react-router-dom";

// Ours - Components
import { Popup } from "./Popup";
import { TaskForm } from "./TaskForm";

// Ours - DB
import { deleteTask, updateTask, TaskStatus } from "@/db";

// Ours - Styles
import styles from "./Task.module.css";

export function Task({ task }) {
  const [showEdit, setShowEdit] = useState(false);
  const { revalidate } = useRevalidator();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const callWrapper = (action, fn) => async () => {
    setLoading(true);

    await fn()
      .catch((reason) => {
        setError(`Error ${action}: ${reason.message}`);
      })
      .then(() => {
        revalidate();
      });

    setLoading(false);
  };

  const onDelete = callWrapper("deleting task", () => deleteTask(task));
  const markComplete = callWrapper("marking task completed", () =>
    updateTask(task.id, { status: TaskStatus.COMPLETED })
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
      <Popup show={showEdit} setShow={setShowEdit}>
        <TaskForm
          task={task}
          onSuccess={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Popup>
    </section>
  );
}
