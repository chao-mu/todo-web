// Firebase
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

const UserStorageKey = "user";

function toUser(firebaseUser) {
  return {
    uid: firebaseUser.uid,
    displayName: firebaseUser.displayName,
    photoURL: firebaseUser.photoURL,
  };
}

onAuthStateChanged(getAuth(), (user) => {
  if (user) {
    localStorage.setItem(UserStorageKey, JSON.stringify(toUser(user)));
  } else {
    localStorage.removeItem(UserStorageKey);
  }
});

export function getUser() {
  const user = localStorage.getItem(UserStorageKey);
  return user ? JSON.parse(user) : null;
}

export function signIn() {
  const auth = getAuth();
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function isSignedIn() {
  return getUser() !== null;
}
