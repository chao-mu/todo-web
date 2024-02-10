// Firebase
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export function signIn() {
  const auth = getAuth();
  return signInWithPopup(auth, new GoogleAuthProvider());
}

export function isSignedIn() {
  const auth = getAuth();
  return auth.currentUser !== null;
}

export function getUser() {
  const auth = getAuth();
  return auth.currentUser;
}
