// Ours - Components
import { FilterableTasks } from "@/components/FilterableTasks";

// Ours - Models
import { getTasks } from "@/models/tasks";

// Ours - Auth
import { getAuthenticatedSession } from "@/server/auth";

export default async function Page() {
  const session = await getAuthenticatedSession();

  const tasksRes = await getTasks(session.user.id);
  if ("error" in tasksRes) {
    throw new Error(`Unable to retrieve tasks: ${tasksRes.error}`);
  }

  const tasks = tasksRes.data;

  return <FilterableTasks tasks={tasks} />;
}
