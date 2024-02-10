// React
import { useState } from "react";

// Ours - DB
import { addTasks, validateTask } from "../db";

// Ours - Styles
import styles from "./BulkTaskUploadForm.module.css";

export function BulkTaskUploadForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);
  const [tasks, setTasks] = useState(null);

  const uploadTasks = async () => {
    setLoading(true);
    await addTasks(tasks)
      .then(() => {
        setTasks([]);
      })
      .catch((reason) => setError(reason.message));
    setLoading(false);
  };

  const parseFile = (e) => {
    e.preventDefault();
    const files = e.target.files;
    if (!files || files.length === 0) {
      return;
    }
    const file = files.item(0);

    const reader = new FileReader();
    reader.onload = () => {
      setTasks(null);
      setError(null);

      let tasks;
      try {
        tasks = JSON.parse(reader.result);
      } catch (error) {
        setError(error.message);
        return;
      }
      for (const [index, task] of tasks.entries()) {
        const errors = validateTask(task);
        if (errors.size > 0) {
          let errorMsg = `Error at index ${index}: `;
          for (const value of errors.values()) {
            errorMsg += `${value}, `;
          }

          setError(errorMsg);
          return;
        }
      }

      setTasks(tasks);
    };

    reader.readAsText(file);
  };

  return (
    <section className={styles["form"]}>
      <input
        className={styles["form__file"]}
        type="file"
        onChange={parseFile}
      />
      <div className={styles["form__task-count"]}>
        {tasks && <span>Tasks: {tasks.length}</span>}
      </div>
      <p className={styles["form__root-error"]}>{error}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button
          disabled={!tasks}
          type="submit"
          className={styles["form__submit"]}
          onClick={uploadTasks}
        >
          Upload
        </button>
      )}
    </section>
  );
}
