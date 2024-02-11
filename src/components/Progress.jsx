import styles from "./Progress.module.css";

export function Progress({ current, total }) {
  const progress = (current / total) * 100;

  return (
    <div className={styles["progress"]}>
      <div
        className={styles["progress__fill"]}
        style={{ width: `${progress}%` }}
      />
      <div className={styles["progress__percentage"]}>
        {current} of {total} completed
      </div>
    </div>
  );
}
