// Ours - Components
import { FilterableTasks } from "@/components/FilterableTasks";

// Ours - API
import { api } from "@/server/api";

export default async function Page() {
  const tasksRes = await api.tasks.all({});
  if ("error" in tasksRes) {
    throw new Error(`Unable to retrieve tasks: ${tasksRes.error}`);
  }

  const goalsRes = await api.goals.all({});
  if ("error" in goalsRes) {
    throw new Error(`Unable to retrieve goals: ${goalsRes.error}`);
  }

  const tasks = tasksRes.data;
  const goals = goalsRes.data.map((goal) => goal.title);

  return <FilterableTasks tasks={tasks} goals={goals} />;
}
