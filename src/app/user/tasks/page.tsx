// Ours - Components
import { FilterableTasks } from "@/components/FilterableTasks";

// Ours - API
import { api } from "@/server/api";

export default async function Page() {
  const tasksRes = await api.tasks.all({});
  if ("error" in tasksRes) {
    throw new Error(`Unable to retrieve tasks: ${tasksRes.error}`);
  }

  const tasks = tasksRes.data;

  return <FilterableTasks tasks={tasks} />;
}
