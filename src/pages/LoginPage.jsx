// React Router
import { useNavigate } from "react-router";

// Ours - Auth
import { signIn } from "../auth";

// Ours - Styles
import styles from "./LoginPage.module.css";

export function LoginPage() {
  const navigate = useNavigate();

  const onSubmit = (e) => {
    e.preventDefault();

    signIn()
      .then(() => {
        navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main className={styles["page"]}>
      <h1>Please Login</h1>
      <button onClick={onSubmit}>Login</button>
    </main>
  );
}
