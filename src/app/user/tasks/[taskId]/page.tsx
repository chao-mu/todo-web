// NextJS
import { notFound } from "next/navigation";

// Ours
import styles from "./page.module.css";
import { Task } from "@/components/Task";
import { api, isAPIError } from "@/server/api";
import { Timer } from "@/components/Timer";

type HasParams = {
  params: {
    taskId: string;
  };
};

export default async function Page({ params: { taskId } }: HasParams) {
  const getRes = await api.tasks.get({ id: Number(taskId) });
  if (isAPIError(getRes)) {
    throw getRes;
  }

  const {
    data: { task },
  } = getRes;

  if (task == null) {
    return notFound();
  }

  return (
    <>
      <Task task={task} />
      <Timer />
    </>
  );
}
