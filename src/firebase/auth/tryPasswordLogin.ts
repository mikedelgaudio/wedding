import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../firebase.service';

interface PasswordLoginRequest {
  password: string;
}

interface PasswordLoginResponse {
  token: string;
}

export async function tryPasswordLogin(password: string): Promise<boolean> {
  if (auth.currentUser) return true;

  try {
    const passwordLogin = httpsCallable<
      PasswordLoginRequest,
      PasswordLoginResponse
    >(functions, 'passwordLogin');

    if (!password || password.trim() === '') {
      console.warn('Password is required');
      return false;
    }

    const result = await passwordLogin({ password });

    await signInWithCustomToken(auth, result.data.token);

    // Successfully authenticated
    return true;
  } catch (e) {
    console.error('Login failed:', e);
    return false;
  }
}
