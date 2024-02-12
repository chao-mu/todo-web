// React
import React from "react";

// React DOM
import ReactDOM from "react-dom/client";

// Ours - Styles
import "./global.css";

// Ours - Firebase
import "./firebase";

// Ours - Router
import { router } from "./router";

// React Router
import { RouterProvider } from "react-router-dom";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />;
  </React.StrictMode>
);
