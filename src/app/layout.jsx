// React Router
import { Outlet } from "react-router-dom";

// React Router DOM
import { Link, useLocation } from "react-router-dom";

// Ours - Styles
import styles from "./layout.module.css";

function NavLinkItem({ to, children, currentPath }) {
  const isActive = currentPath === to;

  return (
    <li className={styles["nav__item"]}>
      <Link
        className={styles[`nav__item__link${isActive ? "--active" : ""}`]}
        to={to}
      >
        {children}
      </Link>
    </li>
  );
}

export default function RootLayout() {
  const location = useLocation();

  return (
    <>
      <header className={styles["header"]}>
        <nav className={styles["nav"]}>
          <ul>
            <NavLinkItem to="/" currentPath={location.pathname}>
              Home
            </NavLinkItem>
            <NavLinkItem to="/tasks" currentPath={location.pathname}>
              Tasks
            </NavLinkItem>
            <NavLinkItem to="/tasks/new" currentPath={location.pathname}>
              New Task
            </NavLinkItem>
          </ul>
        </nav>
      </header>
      <main className={styles["main"]}>
        <Outlet />;
      </main>
    </>
  );
}
