// React Router
import { createBrowserRouter, redirect } from "react-router-dom";

// Ours - Auth
import { isSignedIn } from "./auth";

// Ours - DB
import { getTasks } from "./db";

// Ours - Pages
import LoginPage from "@/app/login/page";
import HomePage from "@/app/page";

// Ours - Layout
import UserLayout from "@/app/layout";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/",
    element: <UserLayout />,
    id: "root",
    loader: async () => {
      if (!isSignedIn()) {
        throw redirect("/login");
      }

      const appData = {
        tasks: await getTasks(),
      };

      return appData;
    },
    children: [
      {
        index: true,
        element: <HomePage />,
      },
    ],
  },
]);
