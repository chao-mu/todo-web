import styles from "./Popup.module.css";

type PopupProps = {
  children: React.ReactNode;
  show: boolean;
};

export function Popup({ children, show }: PopupProps) {
  if (!show) {
    return null;
  }

  return (
    <div className={styles["popup"]}>
      <div className={styles["popup__content"]}>{children}</div>
    </div>
  );
}
