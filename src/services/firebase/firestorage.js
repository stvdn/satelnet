import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

export const uploadFile = (id, path, file) => {
  const storage = getStorage();
  const storageRef = ref(storage, path);
  return uploadBytes(storageRef, file);
};

export const dowloadURL = (path) => {
  const storage = getStorage();
  const fileRef = ref(storage, path);
  return getDownloadURL(fileRef);
};
