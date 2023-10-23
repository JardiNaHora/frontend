import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyBv7M0cKyq-IeSWpSos2b4jF-1jIikprKc",
  authDomain: "projeto-jardineira.firebaseapp.com",
  projectId: "projeto-jardineira",
  storageBucket: "projeto-jardineira.appspot.com",
  messagingSenderId: "540401877071",
  appId: "1:540401877071:web:d337dec96bd43eb573aa3a"
};

export const app = initializeApp(firebaseConfig);
