// NextJS
import Link from "next/link";
import { usePathname } from "next/navigation";

// NextAuth
//import { getServerSession } from "next-auth";

// Ours - Styles
import "./global.css";

// Ours - Styles
import styles from "./layout.module.css";

type NavLinkItemProps = {
  to: string;
  currentPath: string;
  children: React.ReactNode;
};

function NavLinkItem({ to, children, currentPath }: NavLinkItemProps) {
  const isActive = currentPath === to;

  return (
    <li className={styles["nav__item"]}>
      <Link
        className={styles[`nav__item__link${isActive ? "--active" : ""}`]}
        href={to}
      >
        {children}
      </Link>
    </li>
  );
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  //const session = await getServerSession();
  //console.log("session", session);

  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <link rel="icon" type="image/svg+xml" href="/vite.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Vite + React</title>
      </head>
      <body>
        <header className={styles["header"]}>
          <nav className={styles["nav"]}>
            <ul>
              <NavLinkItem to="/" currentPath={pathname}>
                Home
              </NavLinkItem>
              <NavLinkItem to="/tasks" currentPath={pathname}>
                Tasks
              </NavLinkItem>
              <NavLinkItem to="/tasks/new" currentPath={pathname}>
                New Task
              </NavLinkItem>
            </ul>
          </nav>
        </header>
        <main className={styles["main"]}>{children}</main>
      </body>
    </html>
  );
}
