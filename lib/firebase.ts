import { nanoid } from "nanoid";
import { initializeApp } from "firebase/app";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { checkEnvExistence } from "./helpers";

const firebaseConfig = {
  apiKey: checkEnvExistence("FIREBASE_API_KEY"),
  authDomain: checkEnvExistence("FIREBASE_AUTH_DOMAIN"),
  projectId: checkEnvExistence("FIREBASE_PROJECT_ID"),
  storageBucket: checkEnvExistence("FIREBASE_STORAGE_BUCKET"),
  messagingSenderId: checkEnvExistence("FIREBASE_MESSAGING_SENDER_ID"),
  appId: checkEnvExistence("FIREBASE_APP_ID"),
  measurementId: checkEnvExistence("FIREBASE_MEASUREMENT_ID"),
};

const firebaseApp = initializeApp(firebaseConfig);

const firebaseStorage = getStorage(firebaseApp);

export const storeToFirebase = async (image: File) => {
  try {
    const file = image;
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const imageName = nanoid(8) + file.name;
    const storage = ref(firebaseStorage);
    const fileRef = ref(storage, imageName);
    await uploadBytes(fileRef, buffer);
    const imageURL = await getDownloadURL(fileRef);
    return { imageURL, imageName };
  } catch (error) {
    if (error instanceof Error) return { error: error.message };
  }
};

export const deleteFromFirebase = async (imagename: string) => {
  try {
    const file = imagename;
    const fileRef = ref(firebaseStorage, file);
    await deleteObject(fileRef);
    return true;
  } catch (error) {
    if (error instanceof Error)
      console.error("deleteFromFirebase", error.message);
    return false;
  }
};
