export type LegacyTask = {
  title: string;
  contributions: string[];
  goal: string;
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

export async function updateTask(id: number, values: LegacyTask) {
  return;
}

export async function saveTask(task: LegacyTask) {
  return;
}

export async function deleteTask({ id }: { id: number }) {
  return;
}

export async function addTasks(tasks: LegacyTask[]) {
  return;
}

export async function getTasks(): Promise<LegacyTask[]> {
  return new Promise((resolve) => {
    resolve([
      {
        title: "Task 1",
        contributions: ["Contribution 1"],
        goal: "Goal 1",
      },
      {
        title: "Task 2",
        contributions: ["Contribution 2"],
        goal: "Goal 2",
      },
    ]);
  });
}
