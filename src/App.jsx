// React
import { Fragment } from "react";

// React Router
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Link } from "react-router-dom";

// React Hook Form
import { useForm } from "react-hook-form";

// uuid
import { v4 as uuid } from "uuid";

// Ours - Styles
import tasksPageStyles from "./TasksPage.module.css";
import navPageStyles from "./NavPage.module.css";
import taskFormStyles from "./TaskForm.module.css";

// Ours - Data
import daytime from "./data/daytime.json";
import morning from "./data/morning.json";
import oneoffs from "./data/oneoffs.json";

// Add IDs
[daytime, morning, oneoffs].forEach((tasks) => {
  tasks.forEach((task) => {
    task.id = uuid();
  });
});

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TasksPage = ({ title, tasks, addons }) => {
  const styles = tasksPageStyles;

  return (
    <main className={styles["page"]}>
      <h1>{title}</h1>
      {days.map((day) => (
        <div className={styles["header"]} key={day}>
          {day}
        </div>
      ))}
      {tasks.map((task) => (
        <Fragment key={task.id}>
          <div className={styles["daily"]}>{task.title}</div>
          {days.map((day) => (
            <div key={day} className={styles["box"]} />
          ))}
        </Fragment>
      ))}
      {addons && (
        <div className={styles["addons"]}>
          {addons.map((task) => (
            <div key={task.id} className={styles["addon"]}>
              <div className={styles["box"]} />
              {task.title}
            </div>
          ))}
        </div>
      )}
    </main>
  );
};

const TaskForm = ({ onSubmit }) => {
  const styles = taskFormStyles;
  const { register, handleSubmit } = useForm();

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <input
        type="text"
        placeholder="New task"
        className={taskFormStyles["form__title"]}
        {...register("title", { required: true })}
      />
      <input
        type="text"
        placeholder="Goal"
        className={taskFormStyles["form__goal"]}
        {...register("goal")}
      />
      <textarea
        placeholder="Contributions"
        {...register("contributions")}
        className={styles["form__contributions"]}
      />
      <button type="submit" className={styles["form__submit"]}>
        Add
      </button>
    </form>
  );
};

const NavPage = () => {
  const styles = navPageStyles;

  return (
    <main className={styles["page"]}>
      <h1>Nav</h1>
      <nav>
        <Link to="/daytime">Daytime</Link>
        <Link to="/morning">Morning</Link>
      </nav>
      <TaskForm onSubmit={(data) => console.log(data)} />
    </main>
  );
};

const router = createBrowserRouter([
  {
    path: "/",
    element: <NavPage />,
  },
  {
    path: "/daytime",
    element: <TasksPage title="Daytime" tasks={daytime} addons={oneoffs} />,
  },
  {
    path: "/morning",
    element: <TasksPage title="Morning" tasks={morning} />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
