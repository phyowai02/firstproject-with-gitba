import { initializeApp } from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyCIJ4IF59AvsvBIFcNN-NVkMVM7W6GpSBo",
  authDomain: "reacttodo-3e3fb.firebaseapp.com",
  databaseURL:"https://reacttodo-3e3fb-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reacttodo-3e3fb",
  storageBucket: "reacttodo-3e3fb.appspot.com",
  messagingSenderId: "218919273877",
  appId: "1:218919273877:web:08620160d840eb18ad229c",
  measurementId: "G-ZC87HE7E5M"
};

const app = initializeApp(firebaseConfig);

export default app;