// React
import { useId, useState } from "react";

// Ours - Components
import { TaskForm } from "../components/TaskForm";
import { TasksList } from "../components/TasksList";
import { Progress } from "../components/Progress";

// Ours - Hooks
import { useAppData } from "../hooks";

// Ours - Styles
import styles from "./HomePage.module.css";

// Ours - DB
import { TaskStatus } from "../db";

function GoalFilter({ goal, checked, onChange }) {
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

export function HomePage() {
  const appData = useAppData();
  const allGoalKey = useId();

  let tasks = appData.tasks.filter(({ deleted }) => !deleted);

  const goalsSet = new Set();
  for (const task of tasks) {
    goalsSet.add(task.goal);
  }

  const goals = Array.from(goalsSet).sort();

  const [allGoalChecked, setAllGoalChecked] = useState(true);
  const [selectedGoals, setSelectedGoals] = useState(goals);

  const onAllGoalChange = (_, checked) => {
    if (checked) {
      setSelectedGoals(goals);
    } else if (selectedGoals.length === goals.length) {
      setSelectedGoals([]);
    }

    setAllGoalChecked(checked);
  };

  const onGoalFilterChange = (goal, checked) => {
    if (allGoalChecked && !checked) {
      setAllGoalChecked(false);
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
    (task) => task.status === TaskStatus.COMPLETED
  ).length;

  return (
    <>
      <TaskForm />
      <Progress current={completed} total={total} />
      <div className={styles["goals"]}>
        <GoalFilter
          key={allGoalKey}
          goal="All"
          checked={allGoalChecked}
          onChange={onAllGoalChange}
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
