// React Router
import { useRouteLoaderData } from "react-router-dom";

export const useAppData = () => useRouteLoaderData("root");
