// React
import { useState } from "react";

// Ours - Components
import { TaskForm } from "../components/TaskForm";
import { TasksList } from "../components/TasksList";

// Ours - Hooks
import { useAppData } from "../hooks";

// Ours - Styles
import styles from "./HomePage.module.css";

export function HomePage() {
  const allGoal = "All";

  const appData = useAppData();

  let tasks = appData.tasks.filter(({ deleted }) => !deleted);

  const goalsSet = new Set();
  for (const task of tasks) {
    goalsSet.add(task.goal);
  }

  const goals = [allGoal, ...Array.from(goalsSet).sort()];

  const [selectedGoals, setSelectedGoals] = useState([allGoal]);

  const onGoalFilterChange = (goal, checked) => {
    if (goal === allGoal) {
      if (checked) {
        setSelectedGoals(goals);
      } else if (selectedGoals.length === goals.length) {
        setSelectedGoals([]);
      }

      return;
    }

    setSelectedGoals((prev) => {
      if (checked) {
        return [...prev, goal];
      }

      return prev.filter((g) => g !== goal && g !== allGoal);
    });
  };

  tasks = tasks.filter((task) => selectedGoals.includes(task.goal));

  return (
    <main className={styles["page"]}>
      <TaskForm />
      <div className={styles["goals"]}>
        {goals.map((goal) => (
          <label htmlFor={goal} key={goal} className={styles["goals__filter"]}>
            <input
              type="checkbox"
              id={goal}
              onChange={(e) => onGoalFilterChange(goal, e.target.checked)}
              checked={selectedGoals.includes(goal)}
            />
            {goal}
          </label>
        ))}
      </div>
      <section className={styles["tasks"]}>
        <TasksList tasks={tasks} />
      </section>
    </main>
  );
}
