// uuid
import { v4 as uuid } from "uuid";

// Ours - Styles
import styles from "./App.module.css";

// Ours - Data
import dailies from "./data/dailies.json";

// Add IDs to each daily
dailies.forEach((daily) => {
  daily.id = uuid();
});

function App() {
  return <main className={styles["page"]}>{JSON.stringify(dailies)}</main>;
}

export default App;
