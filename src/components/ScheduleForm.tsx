"use client";

// React
import { type ReactNode, useState } from "react";

// React Hook Form
import { useForm } from "react-hook-form";

// NextJS
import { useRouter } from "next/navigation";

// Ours - Components
import { Popup } from "./Popup";

// Ours - Styles
import styles from "./ScheduleForm.module.css";

// Ours - API
import { api } from "@/server/api";

type FormValues = {
  title: string;
  content: string;
};

type ScheduleArg = FormValues & { id?: number };

export type ScheduleFormPopupButtonProps = {
  schedule?: ScheduleArg;
  children: ReactNode;
};

export function ScheduleFormPopupButton({
  schedule,
  children,
}: ScheduleFormPopupButtonProps) {
  const [showEdit, setShowEdit] = useState(false);

  return (
    <>
      <button
        className={styles["new-schedule-button"]}
        onClick={() => setShowEdit(true)}
      >
        {children}
      </button>
      <Popup show={showEdit}>
        <ScheduleForm
          schedule={schedule}
          onSuccess={() => setShowEdit(false)}
          onCancel={() => setShowEdit(false)}
        />
      </Popup>
    </>
  );
}

export type ScheduleFormProps = {
  schedule?: ScheduleArg;
  onCancel?: () => void;
  onSuccess?: () => void;
};

export function ScheduleForm({
  schedule,
  onCancel,
  onSuccess,
}: ScheduleFormProps) {
  const [error, setError] = useState<string | undefined>();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: schedule,
  });

  const router = useRouter();

  const cancel = () => {
    reset();
    setError("");
    if (onCancel) {
      onCancel();
    }
  };

  const onSubmit = handleSubmit(async (formValues: FormValues, e) => {
    e?.preventDefault();

    setLoading(true);

    const saveResult = await api.schedules.save({
      schedule: {
        ...formValues,
        id: schedule?.id,
      },
    });

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
        placeholder="New schedule"
        className={styles["form__title"]}
        {...register("title", { required: true })}
      />
      <ErrorLabel htmlFor="title" />
      <textarea
        placeholder="Content"
        {...register("content")}
        className={styles["form__content"]}
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
