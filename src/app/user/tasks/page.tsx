// Ours - Components
import { FilterableTasks } from "@/components/FilterableTasks";

// Ours - Models
import { getTasks } from "@/app/actions";

export default async function Page() {
  const tasksRes = await getTasks();
  if ("error" in tasksRes) {
    throw new Error(`Unable to retrieve tasks: ${tasksRes.error}`);
  }

  const tasks = tasksRes.data;

  return <FilterableTasks tasks={tasks} />;
}
