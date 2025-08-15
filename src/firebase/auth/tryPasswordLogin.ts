import { signInWithCustomToken } from 'firebase/auth';
import { httpsCallable } from 'firebase/functions';
import { auth, functions } from '../firebase.service';

interface PasswordLoginRequest {
  password: string;
}

interface PasswordLoginResponse {
  token: string;
}

interface ITryPasswordLoginResult {
  success: boolean;
  error?: {
    code: string;
    message: string;
  };
}

export async function tryPasswordLogin(
  password: string,
): Promise<ITryPasswordLoginResult> {
  if (auth.currentUser) return { success: true };

  try {
    const passwordLogin = httpsCallable<
      PasswordLoginRequest,
      PasswordLoginResponse
    >(functions, 'passwordLogin');

    if (!password || password.trim() === '') {
      return {
        success: false,
        error: { code: 'invalid_password', message: 'Password is required' },
      };
    }

    const result = await passwordLogin({ password });

    await signInWithCustomToken(auth, result.data.token);

    // Successfully authenticated
    return { success: true };
    // eslint-disable-next-line
  } catch (e: any) {
    return {
      success: false,
      error: {
        code: e?.code || 'unknown_error',
        message: e?.message || 'An unknown error occurred',
      },
    };
  }
}
