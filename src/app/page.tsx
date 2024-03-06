// NextJS
import { redirect } from "next/navigation";
import Link from "next/link";

// Ours - Auth
import { getServerSession } from "@/server/session";

import styles from "./page.module.css";

export default async function Page() {
  const session = await getServerSession();
  if (session) {
    redirect("/user");
  }

  return (
    <Link className={styles["signin"]} href="/api/auth/signin">
      Login
    </Link>
  );
}
