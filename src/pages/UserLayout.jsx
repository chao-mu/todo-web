// React Router
import { Outlet } from "react-router-dom";

// Ours - Styles
import styles from "./UserLayout.module.css";

export function UserLayout() {
  return (
    <main className={styles["main"]}>
      <Outlet />;
    </main>
  );
}
