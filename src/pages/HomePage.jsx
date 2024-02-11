// React
import { useState } from "react";

// React Router Dom
import { Link } from "react-router-dom";

// Ours - Components
import { TaskForm } from "../components/TaskForm";
import { TasksList } from "../components/TasksList";
import { BulkTaskUploadForm } from "../components/BulkTaskUploadForm";

// Ours - Hooks
import { useAppData } from "../hooks";

// Ours - Styles
import styles from "./HomePage.module.css";

export function HomePage() {
  const allGoal = "All";

  const appData = useAppData();

  let tasks = appData.tasks.filter(({ deleted }) => !deleted);

  const goals = new Set();
  for (const task of tasks) {
    goals.add(task.goal);
  }

  const [selectedGoals, setSelectedGoals] = useState({
    [allGoal]: true,
    ...Object.fromEntries(Array.from(goals).map((goal) => [goal, false])),
  });

  const displayedGoals = [allGoal, ...Array.from(goals).sort()];

  const onGoalFilterChange = (goal, checked) => {
    if (goal === allGoal && checked) {
      setSelectedGoals({
        [goal]: true,
        ...Object.fromEntries(Object.keys(goals).map((key) => [key, false])),
      });

      return;
    }

    setSelectedGoals((prev) => ({
      ...prev,
      [goal]: checked,
    }));
  };

  tasks = tasks.filter((task) => {
    if (selectedGoals[allGoal]) {
      return true;
    }

    return selectedGoals[task.goal];
  });

  return (
    <main className={styles["page"]}>
      <nav>
        <Link to="/daytime">Daytime</Link>
        <Link to="/morning">Morning</Link>
      </nav>
      <TaskForm />
      <div className={styles["goals"]}>
        {displayedGoals.map((goal) => (
          <label htmlFor={goal} key={goal} className={styles["goals__filter"]}>
            <input
              type="checkbox"
              id={goal}
              onChange={(e) => onGoalFilterChange(goal, e.target.checked)}
              checked={selectedGoals[goal]}
            />
            {goal}
          </label>
        ))}
      </div>
      <section className={styles["tasks"]}>
        <TasksList tasks={tasks} />
      </section>
      <BulkTaskUploadForm />
    </main>
  );
}
