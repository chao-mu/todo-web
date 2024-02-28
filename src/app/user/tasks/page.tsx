// Ours - Components
import { FilterableTasks } from "@/components/FilterableTasks";

// Ours - DB
import { getTasks } from "@/db";

// Ours - Auth
import { getServerAuthSession } from "@/server/auth";

export default async function Page() {
  const session = await getServerAuthSession();
  if (!session) {
    throw new Error("Unauthenticated access");
  }

  const tasksRes = await getTasks(session.user.id);
  if ("error" in tasksRes) {
    throw new Error(`Unable to retrieve tasks: ${tasksRes.error}`);
  }

  const tasks = tasksRes.data;

  return <FilterableTasks tasks={tasks} />;
}
