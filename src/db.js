// Firebase
import {
  getFirestore,
  writeBatch,
  addDoc,
  collection,
  getDocs,
} from "firebase/firestore";

// Ours
import { firebaseApp } from "./firebase";
import { getUser } from "./auth";

const getDB = () => getFirestore(firebaseApp);

export function addTask(task) {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  return addDoc(collection(db, `users/${userId}/tasks`), task);
}

export function addTasks(tasks) {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  const batch = writeBatch(db);

  tasks.forEach((task) => {
    const ref = collection(db, `users/${userId}/tasks`);
    addDoc(ref, task);
  });

  return batch.commit();
}

export function validateTask(task) {
  const requiredFields = ["title", "goal", "contributions"];
  const errors = new Map();

  requiredFields.forEach((field) => {
    if (!task[field]) {
      errors.set(field, `${field} required`);
    }
  });

  const arrayFields = ["contributions"];

  arrayFields.forEach((field) => {
    if (!Array.isArray(task[field])) {
      errors.set(field, `${field} must be an array`);
    }
  });

  return errors;
}

export async function getTasks() {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  const snapshot = await getDocs(collection(db, `users/${userId}/tasks`));

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
