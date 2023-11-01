import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCPqvnR4YaH1ZWrMw0aA6ogboIULyJYX7w",
  authDomain: "jardi-na-hora.firebaseapp.com",
  projectId: "jardi-na-hora",
  storageBucket: "jardi-na-hora.appspot.com",
  messagingSenderId: "56263297141",
  appId: "1:56263297141:web:a9f8330b03aef04be7d03c",
  measurementId: "G-XM7DXE5RHL",
};
// export const app = initializeApp(firebaseConfig);
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
