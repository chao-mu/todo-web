// React Router
import { RouterProvider } from "react-router-dom";

// Ours - Firebase
import "./firebase";

// Ours - Router
import { router } from "./router";

export default function App() {
  return <RouterProvider router={router} />;
}
