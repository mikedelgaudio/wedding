import {
  doc,
  DocumentReference,
  getDoc,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';
import {
  trackRsvpError,
  trackRsvpFormLookupSubmit,
  trackRsvpSuccess,
} from '../../utils/analytics';

const RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE =
  'The RSVP service is currently unavailable. Please try again later or contact us for assistance.';

const GENERIC_ERROR_MESSAGE =
  "We couldn't find or access your invitation. Please check your code and try again, or contact us if you need help.";

const RSVP_DEADLINE_PASSED_ERROR_MESSAGE =
  'The RSVP deadline for this RSVP has passed. Please contact us for assistance.';

const CODE_FORMAT = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;

interface RsvpSignInProps {
  onSuccess: (snap: DocumentSnapshot<IRSVPDoc>) => void;
}

export function RsvpSignIn({ onSuccess }: RsvpSignInProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Track form submission
    trackRsvpFormLookupSubmit();

    const trimmed = code.trim().toUpperCase();
    if (!CODE_FORMAT.test(trimmed)) {
      // Track validation error
      trackRsvpError('validation_error', 'invalid_code_format');

      setError(
        'Please enter your code in the format of XXXX-XXXX. Make sure to include the dash.',
      );
      setLoading(false);
      return;
    }

    const cleaned = trimmed.replace(/-/g, '');

    try {
      const untypedRef = doc(db, 'rsvp', cleaned);
      const ref = untypedRef as DocumentReference<IRSVPDoc>;
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        // Track document not found error
        trackRsvpError('not_found_error', 'rsvp_code_not_found');
        setError(GENERIC_ERROR_MESSAGE);
      } else {
        const data = snap.data();
        if (data.rsvpDeadline.toDate() < new Date()) {
          // Track deadline passed error
          trackRsvpError('deadline_error', 'rsvp_deadline_passed');
          setError(RSVP_DEADLINE_PASSED_ERROR_MESSAGE);
        } else {
          // Track successful lookup
          trackRsvpSuccess();
          onSuccess(snap);
        }
      }
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };

      if (firebaseError.code === 'unavailable') {
        // Track service unavailable error with Firebase details
        trackRsvpError(
          'firebase_service_error',
          firebaseError.code,
          firebaseError.message,
        );
        setError(RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE);
      } else {
        // Track other Firebase errors with Firebase details
        trackRsvpError(
          'firebase_error',
          firebaseError.code,
          firebaseError.message,
        );
        setError(GENERIC_ERROR_MESSAGE);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <p className="text-lg">
        We hope you'll be able to join us—it would mean so much to celebrate
        together! But we also understand that summer is a busy time and travel
        isn't always easy. If you're unable to attend, please know that your
        love and support still mean the world to us.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <label
            htmlFor="rsvpCode"
            className="text-xl font-semibold mb-2 block"
          >
            Enter your RSVP code
          </label>
          <p className="text-sm">
            Questions?{' '}
            <a
              className="underline focus:outline-none focus:ring  hover:no-underline"
              href="mailto:wedding@delgaudio.dev"
            >
              Contact us
            </a>
          </p>
        </div>
        <input
          type="text"
          id="rsvpCode"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Example: XXXX-XXXX"
          className="w-full p-2 border rounded focus:outline-none focus:ring mb-2"
          aria-invalid={!!error}
          aria-describedby={error ? 'rsvp-error' : undefined}
        />
        {error && (
          <div className="bg-red-700 font-bold text-white mb-4 p-4 rounded">
            <p id="rsvp-error" role="alert">
              {error}
            </p>
          </div>
        )}
        <p className="text-md">
          The RSVP code is on your invitation in the format{' '}
          <strong>XXXX-XXXX</strong>.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full focus:outline-none focus:ring  cursor-pointer bg-stone-900 text-white mt-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Checking…' : 'Lookup'}
        </button>
      </form>
    </>
  );
}
