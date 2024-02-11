// Firebase
import {
  getFirestore,
  writeBatch,
  addDoc,
  updateDoc,
  collection,
  getDocs,
  doc,
} from "firebase/firestore";

// Ours
import { firebaseApp } from "./firebase";
import { getUser } from "./auth";

/**
 * @typedef {Object} Task
 * @property {string} title
 * @property {string[]} contributions
 * @property {string} goal
 */

const getDB = () => getFirestore(firebaseApp);

const taskCollectionPath = ({ userId }) => ["users", userId, "tasks"];

export function saveTask(task) {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  const collectionPath = taskCollectionPath({ userId });

  if (task.id) {
    const ref = doc(db, ...collectionPath, task.id);

    return updateDoc(ref, task);
  } else {
    return addDoc(collection(db, ...collectionPath), task);
  }
}

export function deleteTask({ id }) {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  const ref = doc(db, ...taskCollectionPath({ userId }), id);

  return updateDoc(ref, { deleted: true });
}

export function addTasks(tasks) {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  const batch = writeBatch(db);

  tasks.forEach((task) => {
    addDoc(taskCollectionPath({ userId }), task);
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

  const taskCollection = collection(db, ...taskCollectionPath({ userId }));
  const snapshot = await getDocs(taskCollection);

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
