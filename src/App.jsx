// React
import { Fragment, useState } from "react";

// React Router
import {
  createBrowserRouter,
  RouterProvider,
  redirect,
  useRouteLoaderData,
  useRevalidator,
} from "react-router-dom";
import { Link } from "react-router-dom";

// React Hook Form
import { useForm } from "react-hook-form";

// uuid
import { v4 as uuid } from "uuid";

// Ours - Styles
import tasksPageStyles from "./TasksPage.module.css";
import homePageStyles from "./HomePage.module.css";
import taskFormStyles from "./TaskForm.module.css";
import loginPageStyles from "./LoginPage.module.css";
import tasksListStyles from "./TasksList.module.css";

// Ours - Data
import daytime from "./data/daytime.json";
import morning from "./data/morning.json";
import oneoffs from "./data/oneoffs.json";

// Ours - Firebase
import "./firebase";

// Ours - Auth
import { isSignedIn, signIn } from "./auth";

// Ours - Persistance
import { getTasks, addTask } from "./db";

// Add IDs
[daytime, morning, oneoffs].forEach((tasks) => {
  tasks.forEach((task) => {
    task.id = uuid();
  });
});

/**
 * @typedef {Object} AppData
 * @property {Task[]} tasks
 */

/**
 * @typedef {Object} Task
 * @property {string} title
 * @property {string[]} contributions
 * @property {string} goal
 */

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

const TaskForm = () => {
  const [error, setError] = useState();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { revalidate } = useRevalidator();

  const styles = taskFormStyles;

  const onSubmit = async ({ contributions, title, goal }, e) => {
    e.preventDefault();

    setLoading(true);

    await addTask({
      title,
      goal,
      contributions: contributions.split("\n").map((line) => line.trim()),
    })
      .then(() => {
        revalidate();
      })
      .catch((reason) => setError(reason.message));

    setLoading(false);
  };

  const ErrorLabel = ({ htmlFor }) => {
    const error = errors[htmlFor];
    return error ? (
      <label htmlFor={htmlFor} className={styles["form__error"]}>
        {error.type}
      </label>
    ) : null;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles["form"]}>
      <input
        type="text"
        placeholder="New task"
        className={styles["form__title"]}
        {...register("title", { required: true })}
      />
      <ErrorLabel htmlFor="title" />
      <input
        type="text"
        placeholder="Goal"
        className={styles["form__goal"]}
        {...register("goal", { required: true })}
      />
      <ErrorLabel htmlFor="goal" />
      <textarea
        placeholder="Contributions"
        {...register("contributions")}
        className={styles["form__contributions"]}
      />
      <p className={styles["form__root-error"]}>{error}</p>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <button type="submit" className={styles["form__submit"]}>
          Add
        </button>
      )}
    </form>
  );
};

/** @returns {AppData} */
const useAppData = () => useRouteLoaderData("root");

function TasksList({ tasks }) {
  const styles = tasksListStyles;

  return (
    <section className={styles["tasks-list"]}>
      {tasks.map((task) => (
        <div key={task.id} className={styles["tasks-list__item"]}>
          <div className={styles["task__title"]}>{task.title}</div>
          <div className={styles["goal__title"]}>{task.goal}</div>
          <div className={styles["goal__contributons"]}>
            {task.contributions.map((contribution, idx) => (
              <div key={idx} className={styles["goal__contribution"]}>
                {contribution}
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}

const HomePage = () => {
  const styles = homePageStyles;

  const appData = useAppData();

  return (
    <main className={styles["page"]}>
      <nav>
        <Link to="/daytime">Daytime</Link>
        <Link to="/morning">Morning</Link>
      </nav>
      <TaskForm onSubmit={(data) => console.log(data)} />
      <section className={styles["tasks"]}>
        <TasksList tasks={appData.tasks} />
      </section>
    </main>
  );
};

function LoginPage() {
  const styles = loginPageStyles;

  const onSubmit = (e) => {
    e.preventDefault();

    signIn()
      .then(() => {
        router.navigate("/");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <main className={styles["page"]}>
      <h1>Please Login</h1>
      <button onClick={onSubmit}>Login</button>
    </main>
  );
}

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    loader: async () => {
      if (!isSignedIn()) {
        throw redirect("/login");
      }

      /** @type {AppData} */
      const appData = {
        tasks: await getTasks(),
      };

      return appData;
    },
    id: "root",
    children: [
      {
        path: "/",
        element: <HomePage />,
      },
      {
        path: "/daytime",
        element: <TasksPage title="Daytime" tasks={daytime} addons={oneoffs} />,
      },
      {
        path: "/morning",
        element: <TasksPage title="Morning" tasks={morning} />,
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
