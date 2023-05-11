import { FirebaseOptions, initializeApp } from "firebase/app";

const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyCpH4M4844rZYF9duxer45rTrYj6zErT_g",
  authDomain: "todoapp-d3b57.firebaseapp.com",
  projectId: "todoapp-d3b57",
  storageBucket: "todoapp-d3b57.appspot.com",
  messagingSenderId: "890377760325",
  appId: "1:890377760325:web:4884f966a03ca3666bfd2c",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
