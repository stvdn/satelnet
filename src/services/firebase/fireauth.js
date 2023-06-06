import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";

export const createUserEmail = (data) => {
  const auth = getAuth();
  return createUserWithEmailAndPassword(auth, data.email, data.password);
};

export const signInWithEmail = (data) => {
  const auth = getAuth();
  return signInWithEmailAndPassword(auth, data.email, data.password);
};

export const signInWithGoogle = (data) => {
  const auth = getAuth();
  auth.useDeviceLanguage();
  const provider = new GoogleAuthProvider();
  return signInWithPopup(auth, provider);
};
