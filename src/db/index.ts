export type LegacyTask = {
  title: string;
  contributions: string[];
  goal: string;
  steps: string[];
  status: TaskStatus;
  deleted: boolean;
};

export type PersistedLegacyTask = LegacyTask & {
  id: number;
};

export type Task = {
  title: string;
};

export type GoalContribution = {
  reason: string;
};

export type Goal = {
  title: string;
};

export type Tasks = {
  tasks: Task[];
  goals: Record<number, Goal>;
  goalContributions: Record<number, GoalContribution[]>;
};

export enum TaskStatus {
  Pending = "PENDING",
  Completed = "COMPLETED",
}

export type QueryResult<T> = { data: T } | { error: string };

export async function updateTask(
  id: number,
  values: Partial<LegacyTask>,
): Promise<QueryResult<void>> {
  console.log("Updating task", id, values);
  return { error: "unimplemented" };
}

export async function saveTask(task: LegacyTask): Promise<QueryResult<void>> {
  console.log("Saving task", task);
  return { error: "unimplemented" };
}

export async function deleteTask({
  id,
}: {
  id: number;
}): Promise<QueryResult<void>> {
  console.log("Deleting task", id);
  return { error: "unimplemented" };
}

export async function addTasks(
  tasks: LegacyTask[],
): Promise<QueryResult<void>> {
  console.log("Adding tasks", tasks);
  return { error: "unimplemented" };
}

export async function getTasks(): Promise<QueryResult<PersistedLegacyTask[]>> {
  const mockData: PersistedLegacyTask[] = [
    {
      id: 1,
      title: "Task 1",
      contributions: ["Contribution 1"],
      goal: "Goal 1",
      steps: ["Step 1", "Step 2"],
      deleted: false,
      status: TaskStatus.Pending,
    },
    {
      id: 2,
      title: "Task 2",
      contributions: ["Contribution 2"],
      goal: "Goal 2",
      steps: ["Step 3", "Step 4"],
      deleted: false,
      status: TaskStatus.Completed,
    },
  ];

  return new Promise((resolve) =>
    resolve({
      data: mockData,
    }),
  );
}
