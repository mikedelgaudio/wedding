import { getAnalytics } from 'firebase/analytics';
import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getFunctions } from 'firebase/functions';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env
    .VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

// App Check
const appCheckSiteKey = import.meta.env
  .VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY;
if (!appCheckSiteKey) {
  throw new Error(
    'VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY is not defined in .env',
  );
}
initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(appCheckSiteKey),
  isTokenAutoRefreshEnabled: true,
});

// Firebase services
export const db = getFirestore(app);
export const auth = getAuth(app);
export const functions = getFunctions(app);
export const analytics = getAnalytics(app);

// Optional: connect to emulators
// connectFirestoreEmulator(db, 'localhost', 8080);
// connectFunctionsEmulator(functions, 'localhost', 5001);
// connectAuthEmulator(auth, 'http://localhost:9099'); // Optional
