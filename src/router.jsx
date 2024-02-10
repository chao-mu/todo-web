// React Router
import { createBrowserRouter, redirect } from "react-router-dom";

// Ours - Auth
import { isSignedIn } from "./auth";

// Ours - DB
import { getTasks } from "./db";

// uuid
import { v4 as uuid } from "uuid";

// Pages
import { LoginPage } from "./pages/LoginPage";
import { HomePage } from "./pages/HomePage";
import { TasksPage } from "./pages/TasksPage";

// Ours - Data
import daytime from "./data/daytime.json";
import morning from "./data/morning.json";
import oneoffs from "./data/oneoffs.json";

// Add IDs
[daytime, morning, oneoffs].forEach((tasks) => {
  tasks.forEach((task) => {
    task.id = uuid();
  });
});

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
      {
        path: "/daytime",
        element: <TasksPage title="Daytime" tasks={daytime} addons={oneoffs} />,
      },
      {
        path: "/morning",
        element: <TasksPage title="Morning" tasks={morning} />,
      },
    ],
  },
]);
