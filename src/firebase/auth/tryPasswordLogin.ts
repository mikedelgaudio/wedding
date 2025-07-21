import { signInAnonymously } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase.service';

// Hash a string with SHA-256 and return hex string
async function sha256(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export async function tryPasswordLogin(password: string): Promise<boolean> {
  const currentUser = auth.currentUser;
  if (!currentUser) {
    const docSnap = await getDoc(doc(db, 'site', 'siteinfo'));
    const storedHash = docSnap.data()?.sitepassword;

    if (!storedHash) {
      throw new Error('Missing password hash');
    }

    const inputHash = await sha256(password);

    if (inputHash === storedHash) {
      signInAnonymously(auth);
      return true;
    }

    return false;
  }
  return true; // User is already logged in
}
