// React
import { useState } from "react";

// React Hook Form
import { useForm } from "react-hook-form";

// React Router
import { useRevalidator } from "react-router-dom";

// Ours - Styles
import styles from "./TaskForm.module.css";

// Ours - DB
import { addTask } from "../db";

export function TaskForm() {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { revalidate } = useRevalidator();

  const onSubmit = async ({ contributions, title, goal }, e) => {
    e.preventDefault();

    setLoading(true);

    await addTask({
      title,
      goal,
      contributions: contributions.split("\n").map((line) => line.trim()),
    })
      .then(() => {
        revalidate();
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
      <p className={styles["form__root-error"]}>{error}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button type="submit" className={styles["form__submit"]}>
          Add
        </button>
      )}
    </form>
  );
}
