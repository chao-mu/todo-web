// React
import { useState } from "react";

// Ours - Components
import { Popup } from "./Popup";
import { TaskForm } from "./TaskForm";

// Ours - Styles
import styles from "./Task.module.css";

export function Task({ task }) {
  const [showEdit, setShowEdit] = useState(false);

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
        <button
          className={styles["action-bar__button"]}
          onClick={() => setShowEdit(true)}
        >
          Edit
        </button>
      </div>
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
