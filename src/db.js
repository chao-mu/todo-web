// Firebase
import { getFirestore, addDoc, collection, getDocs } from "firebase/firestore";

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

export async function getTasks() {
  const db = getDB();
  const user = getUser();
  const userId = user.uid;

  const snapshot = await getDocs(collection(db, `users/${userId}/tasks`));

  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
}
