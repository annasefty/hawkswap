import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_gkG4JiO7BHy1affhbpmk5nseF_Mb9ag",
  authDomain: "hawkswap-802c6.firebaseapp.com",
  projectId: "hawkswap-802c6",
  storageBucket: "hawkswap-802c6.firebasestorage.app",
  messagingSenderId: "877499815135",
  appId: "1:877499815135:web:3ac80d8ec6cf89b8a4856a",
  measurementId: "G-9EFEVJPM1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const storage = getStorage(app);
const db = getFirestore(app);

// Log configurations for debugging
console.log('Firebase initialized:', {
  projectId: app.options.projectId,
  storageBucket: app.options.storageBucket,
  authDomain: app.options.authDomain,
  currentHost: window.location.origin
});

export { auth, provider, storage, db };