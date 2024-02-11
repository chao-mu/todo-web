// React Router
import { createBrowserRouter, redirect } from "react-router-dom";

// Ours - Auth
import { isSignedIn } from "./auth";

// Ours - DB
import { getTasks } from "./db";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    loader: async () => {
      if (!isSignedIn()) {
        throw redirect("/login");
      }

      const appData = {
        tasks: await getTasks(),
      };

      return appData;
    },
    id: "root",
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
    ],
  },
]);
