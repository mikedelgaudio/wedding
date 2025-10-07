import { getAuth } from 'firebase-admin/auth';
import * as functions from 'firebase-functions';
import { logger } from 'firebase-functions';

// Environment-based shared password
const SHARED_PASSWORD = process.env.AUTH_PASSWORD;

if (!SHARED_PASSWORD) {
  throw new Error('AUTH_PASSWORD environment variable is not set');
}

export const passwordLogin = functions.https.onCall(async request => {
  logger.info('Password attempt received');

  // ✅ Enforce App Check (includes ReCAPTCHA protection)
  if (!request.app) {
    logger.warn('App Check missing');
    throw new functions.https.HttpsError(
      'failed-precondition',
      'App Check is required.',
    );
  }

  // ✅ Validate input
  const { password } = request.data;

  if (typeof password !== 'string' || password.trim() === '') {
    logger.warn('Missing or invalid password');
    throw new functions.https.HttpsError(
      'invalid-argument',
      'Password is required.',
    );
  }

  if (password !== SHARED_PASSWORD) {
    logger.warn('Invalid password attempt');
    throw new functions.https.HttpsError(
      'unauthenticated',
      'Invalid password.',
    );
  }

  logger.info('Password accepted');

  const uid = 'site-guest';

  try {
    const token = await getAuth().createCustomToken(uid);
    return { token };
  } catch (err) {
    logger.error('Token creation failed', err);
    throw new functions.https.HttpsError('internal', 'Token generation failed');
  }
});
