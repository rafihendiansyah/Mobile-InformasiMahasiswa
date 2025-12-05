// src/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
let ReactNativeAsyncStorage;
try {
  ReactNativeAsyncStorage =
    require("@react-native-async-storage/async-storage").default;
} catch (e) {
  ReactNativeAsyncStorage = undefined;
}
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAtpekhtJvgGLpzSgUK54lXDTxv2-O8-UY",
  authDomain: "mahasiswaapp-f75fd.firebaseapp.com",
  projectId: "mahasiswaapp-f75fd",
  storageBucket: "mahasiswaapp-f75fd.firebasestorage.app",
  messagingSenderId: "1044995724636",
  appId: "1:1044995724636:web:f03b65941638d2b60e5d99",
};

const app = initializeApp(firebaseConfig);

export let auth;
if (ReactNativeAsyncStorage) {
  try {
    auth = initializeAuth(app, {
      persistence: getReactNativePersistence(ReactNativeAsyncStorage),
    });
    console.info(
      "Firebase Auth: initialized with ReactNative AsyncStorage persistence"
    );
  } catch (e) {
    console.warn("initializeAuth failed, falling back to getAuth:", e);
    auth = getAuth(app);
  }
} else {
  auth = getAuth(app);
}
export const db = getFirestore(app);
