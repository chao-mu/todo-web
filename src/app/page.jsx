// React
import { useId, useState } from "react";

// React Router DOM
import { Link } from "react-router-dom";

// Ours - Styles
import styles from "./page.module.css";

export default function Page() {
  return (
    <>
      <section className={styles["hero"]}>
        <h1>Welcome!</h1>
        <p>Best of luck on your tasks, my friend.</p>
      </section>
    </>
  );
}
