import styles from "./Popup.module.css";

export function Popup({ children, show }) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles["popup"]}>
      <div className={styles["popup__content"]}>{children}</div>
    </div>
  );
}
