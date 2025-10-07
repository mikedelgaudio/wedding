import dotenv from 'dotenv';
import { initializeApp } from 'firebase-admin/app';

dotenv.config();

// Initialize Firebase Admin
initializeApp({
  serviceAccountId:
    'wedding-functions@wedding-rsvp-25b5b.iam.gserviceaccount.com',
});

// Export functions
export { passwordLogin } from './passwordLogin';
export { sendRsvpConfirmation } from './emailService';
