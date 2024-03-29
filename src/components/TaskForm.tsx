"use client";

// React
import { useState } from "react";

// React Hook Form
import { useForm } from "react-hook-form";

// NextJS
import { useRouter } from "next/navigation";

// Ours - Components
import { Popup } from "./Popup";

// Ours - Styles
import styles from "./TaskForm.module.css";

// Ours - API
import { api } from "@/server/api";

type FormValues = {
  id?: number;
  title: string;
  goal: string;
  steps: string;
  repeatable: boolean;
};

export type NewTaskPopupButtonProps = {
  task: FormValues;
};

export function NewTaskPopupButton({ task }: NewTaskPopupButtonProps) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <button
        className={styles["new-task-button"]}
        onClick={() => setShowEdit(true)}
      >
        New Task
      </button>
      <Popup show={showEdit}>
        <TaskForm
          task={task}
          onSuccess={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Popup>
    </>
  );
}

export type TaskFormProps = {
  task?: FormValues;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function TaskForm({ task, onCancel, onSuccess }: TaskFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      id: task?.id,
      title: task?.title,
      goal: task?.goal,
      steps: task?.steps,
      repeatable: task?.repeatable ?? false,
    },
  });

  const router = useRouter();

  const cancel = () => {
    reset();
    setError("");
    if (onCancel) {
      onCancel();
    }
  };

  const onSubmit = handleSubmit(async (task: FormValues, e) => {
    e?.preventDefault();

    setLoading(true);

    const saveResult = await api.tasks.save({ task });

    if ("error" in saveResult) {
      setError(saveResult.error);
    } else {
      router.refresh();
      if (onSuccess) {
        onSuccess();
      }

      reset();
    }

    setLoading(false);
  });

  const ErrorLabel = ({ htmlFor }: { htmlFor: keyof typeof errors }) => {
    const error = errors[htmlFor];
    return error ? (
      <label htmlFor={htmlFor} className={styles["form__error"]}>
        {error.type}
      </label>
    ) : null;
  };

  return (
    <form onSubmit={onSubmit} className={styles["form"]}>
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
        placeholder="Steps"
        {...register("steps")}
        className={styles["form__steps"]}
      />
      <label htmlFor="repeatable" className={styles["form__repeatable"]}>
        Repeatable?
        <input type="checkbox" {...register("repeatable")} />
      </label>
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
