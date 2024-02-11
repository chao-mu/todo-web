// React
import { useState } from "react";

// React Router
import { useRevalidator } from "react-router-dom";

// Ours - Components
import { Popup } from "./Popup";
import { TaskForm } from "./TaskForm";

// Ours - DB
import { deleteTask } from "../db";

// Ours - Styles
import styles from "./Task.module.css";

export function Task({ task }) {
  const [showEdit, setShowEdit] = useState(false);
  const { revalidate } = useRevalidator();
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    setLoading(true);

    await deleteTask(task)
      .catch((reason) => {
        setError(`Error deleting task: ${reason.message}`);
      })
      .then(() => {
        revalidate();
      });

    setLoading(false);
  };

  return (
    <section className={styles["task"]}>
      <div className={styles["task__title"]}>{task.title}</div>
      <div className={styles["goal__title"]}>{task.goal}</div>
      <div className={styles["goal__contributions"]}>
        {task.contributions.map((contribution, idx) => (
          <div key={idx} className={styles["goal__contribution"]}>
            {contribution}
          </div>
        ))}
      </div>
      <div className={styles["action-bar"]}>
        {loading ? (
          "Loading..."
        ) : (
          <>
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
