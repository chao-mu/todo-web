// Firebase
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";

import type { User as FirebaseUser } from "firebase/auth";

const UserStorageKey = "user";

type AuthUser = {
  uid: string;
  displayName: string | null;
  photoURL: string | null;
};

function toUser(firebaseUser: FirebaseUser): AuthUser {
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
  return user ? (JSON.parse(user) as AuthUser) : null;
}

export function signIn() {
  const auth = getAuth();
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function isSignedIn() {
  return getUser() !== null;
}
