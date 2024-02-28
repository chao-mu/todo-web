"use client";

// React
import { useId, useState } from "react";

// Ours - Components
import { TasksList } from "@/components/TasksList";
import { Progress } from "@/components/Progress";

// Ours - Styles
import styles from "./FilterableTasks.module.css";

// Ours - DB
import { TaskStatus, PersistedLegacyTask } from "@/db";

type GoalFilterProps = {
  goal: string;
  checked: boolean;
  onChange: (goal: string, checked: boolean) => void;
};

function GoalFilter({ goal, checked, onChange }: GoalFilterProps) {
  return (
    <label htmlFor={goal} className={styles["goals__filter"]}>
      <input
        type="checkbox"
        id={goal}
        checked={checked}
        onChange={(e) => onChange(goal, e.target.checked)}
      />
      {goal}
    </label>
  );
}

export type FilterableTasksProps = {
  tasks: PersistedLegacyTask[];
};

export function FilterableTasks({ tasks }: FilterableTasksProps) {
  const allGoalKey = useId();

  tasks = tasks.filter(({ deleted }) => !deleted);

  const goalsSet = new Set<string>();
  for (const task of tasks) {
    goalsSet.add(task.goal);
  }

  const goals = Array.from(goalsSet).sort();

  const [allGoalChecked, setAllGoalChecked] = useState(true);
  const [selectedGoals, setSelectedGoals] = useState(goals);

  const onAllGoalChange = (checked: boolean) => {
    if (checked) {
      setSelectedGoals(goals);
    } else if (selectedGoals.length === goals.length) {
      setSelectedGoals([]);
    }

    setAllGoalChecked(checked);
  };

  const onGoalFilterChange = (goal: string, checked: boolean) => {
    if (goal == allGoalKey) {
      onAllGoalChange(checked);
      return;
    }
    if (allGoalChecked && !checked) {
      setAllGoalChecked(false);
    } else if (checked && selectedGoals.length === goals.length - 1) {
      setAllGoalChecked(true);
    }

    setSelectedGoals((prev) => {
      if (checked) {
        return [...prev, goal];
      }

      return prev.filter((g) => g !== goal);
    });
  };

  tasks = tasks.filter((task) => selectedGoals.includes(task.goal));

  const total = tasks.length;

  const completed = tasks.filter(
    (task) => task.status === TaskStatus.Completed,
  ).length;

  return (
    <>
      <Progress current={completed} total={total} />
      <div className={styles["goals"]}>
        <GoalFilter
          key={allGoalKey}
          goal={allGoalKey}
          checked={allGoalChecked}
          onChange={onGoalFilterChange}
        />
        {goals.map((goal) => (
          <GoalFilter
            key={goal}
            goal={goal}
            checked={selectedGoals.includes(goal)}
            onChange={onGoalFilterChange}
          />
        ))}
      </div>
      <section className={styles["tasks"]}>
        <TasksList tasks={tasks} />
      </section>
    </>
  );
}
