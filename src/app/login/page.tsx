"use client";

// React Router
import { useRouter } from "next/navigation";

// Ours - Auth
import { signIn } from "@/auth";

// Ours - Styles
import styles from "./page.module.css";

// Ours - Firebase
import "@/app/firebase";

export default function Page() {
  const router = useRouter();

  const onSubmit = () => {
    signIn()
      .then(() => {
        router.push("/");
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
