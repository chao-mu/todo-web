import styles from "./Progress.module.css";

export type ProgressProps = {
  current: number;
  total: number;
  what?: string;
};

export function Progress({ current, total, what }: ProgressProps) {
  const progress = (current / total) * 100;
  what ??= "";

  return (
    <div className={styles["progress"]}>
      <div
        className={styles["progress__fill"]}
        style={{ width: `${progress}%` }}
      />
      <div className={styles["progress__percentage"]}>
        {current} of {total} {what} completed
      </div>
    </div>
  );
}
