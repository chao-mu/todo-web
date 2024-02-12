// React Router
import { Outlet } from "react-router-dom";

// Ours - Styles
import styles from "./layout.module.css";

export default function RootLayout() {
  return (
    <main className={styles["main"]}>
      <Outlet />;
    </main>
  );
}
