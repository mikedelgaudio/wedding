import { initializeApp } from 'firebase/app';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_REACT_APP_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env
    .VITE_REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_REACT_APP_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);

const appCheckSiteKey = import.meta.env
  .VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY;

if (!appCheckSiteKey) {
  throw new Error(
    'VITE_REACT_APP_FIREBASE_APP_CHECK_SITE_KEY is not defined in .env',
  );
}

initializeAppCheck(app, {
  provider: new ReCaptchaV3Provider(appCheckSiteKey),
  // Automatically refresh tokens
  isTokenAutoRefreshEnabled: true,
});

export const db = getFirestore(app);
