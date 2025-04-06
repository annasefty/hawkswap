import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getStorage, connectStorageEmulator } from "firebase/storage";
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD_gkG4JiO7BHy1affhbpmk5nseF_Mb9ag",
  authDomain: "hawkswap-802c6.firebaseapp.com",
  projectId: "hawkswap-802c6",
  storageBucket: "hawkswap-802c6.appspot.com",
  messagingSenderId: "877499815135",
  appId: "1:877499815135:web:3ac80d8ec6cf89b8a4856a",
  measurementId: "G-9EFEVJPM1Y"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Initialize Storage
const storage = getStorage(app);

// Initialize Firestore
const db = getFirestore(app);

// Use emulators in development, real services in production
const isLocalhost = window.location.hostname === 'localhost';
if (isLocalhost) {
  try {
    console.log('Development environment detected - using emulators');
    
    // Connect to Storage emulator
    connectStorageEmulator(storage, 'localhost', 9199);
    
    // Connect to Firestore emulator
    connectFirestoreEmulator(db, 'localhost', 8080);
    
    console.log('Successfully connected to emulators');
  } catch (error) {
    console.error('Failed to connect to emulators:', error);
    console.log('Falling back to production services');
  }
} else {
  console.log('Production environment detected - using Firebase services');
}

// Log configurations for debugging
console.log('Firebase initialized:', {
  projectId: app.options.projectId,
  storageBucket: app.options.storageBucket,
  authDomain: app.options.authDomain,
  environment: isLocalhost ? 'development' : 'production'
});

// Log storage configuration
console.log('Storage configuration:', {
  app: storage.app.name,
  bucket: app.options.storageBucket,
  isEmulator: isLocalhost,
  host: isLocalhost ? 'localhost:9199' : 'firebasestorage.googleapis.com'
});

export { auth, provider, storage, db };