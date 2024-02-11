// React
import { useState } from "react";

// React Hook Form
import { useForm } from "react-hook-form";

// React Router
import { useRevalidator } from "react-router-dom";

// Ours - Components
import { Popup } from "./Popup";

// Ours - Styles
import styles from "./TaskForm.module.css";

// Ours - DB
import { saveTask } from "../db";

export function NewTaskPopupButton({ task }) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <button
        className={styles["new-task-button"]}
        onClick={() => setShowEdit(true)}
      >
        New Task
      </button>
      <Popup show={showEdit} setShow={setShowEdit}>
        <TaskForm
          task={task}
          onSuccess={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Popup>
    </>
  );
}

function arrayFromText(text) {
  if (!text) {
    return [];
  }

  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line);
}

export function TaskForm({ task, onCancel, onSuccess }) {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: task?.title || "",
      goal: task?.goal || "",
      contributions: (task?.contributions || []).join("\n"),
      steps: (task?.steps || []).join("\n"),
    },
  });

  const { revalidate } = useRevalidator();

  const cancel = () => {
    reset();
    setError("");
    if (onCancel) {
      onCancel();
    }
  };

  const onSubmit = async ({ contributions, steps, title, goal }, e) => {
    e.preventDefault();

    setLoading(true);

    await saveTask({
      ...task,
      title,
      goal,
      contributions: arrayFromText(contributions),
      steps: arrayFromText(steps),
    })
      .then(() => {
        revalidate();
        if (onSuccess) {
          onSuccess();
        }
      })
      .catch((reason) => setError(reason.message));

    setLoading(false);
  };

  const ErrorLabel = ({ htmlFor }) => {
    const error = errors[htmlFor];
    return error ? (
      <label htmlFor={htmlFor} className={styles["form__error"]}>
        {error.type}
      </label>
    ) : null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <input
        type="text"
        placeholder="New task"
        className={styles["form__title"]}
        {...register("title", { required: true })}
      />
      <ErrorLabel htmlFor="title" />
      <input
        type="text"
        placeholder="Goal"
        className={styles["form__goal"]}
        {...register("goal", { required: true })}
      />
      <ErrorLabel htmlFor="goal" />
      <textarea
        placeholder="Contributions"
        {...register("contributions")}
        className={styles["form__contributions"]}
      />
      <textarea
        placeholder="Steps"
        {...register("steps")}
        className={styles["form__steps"]}
      />
      <p className={styles["form__root-error"]}>{error}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className={styles["form__buttons"]}>
          <button
            type="reset"
            onClick={() => cancel()}
            className={styles["form__button"]}
          >
            Cancel
          </button>
          <button type="submit" className={styles["form__button"]}>
            Save
          </button>
        </div>
      )}
    </form>
  );
}
