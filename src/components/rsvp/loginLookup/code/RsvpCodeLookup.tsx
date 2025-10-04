import { doc, DocumentReference, getDoc } from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import { db } from '../../../../firebase/firebase.service';
import type { IRSVPDoc } from '../../../../firebase/IRSVPDoc';
import { trackEvent } from '../../../../utils/analytics';
import type { IRsvpScreenProps } from '../../models/IRsvpScreenProps';
import {
  GENERIC_ERROR_MESSAGE,
  RSVP_DEADLINE_PASSED_ERROR_MESSAGE,
  RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE,
} from '../../utils/errors';
import { RsvpHeader } from '../RsvpHeader';

const CODE_FORMAT = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;

export function RsvpCodeLookup({
  onSuccess,
  onBackToMethodSelection,
}: IRsvpScreenProps) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Track form submission
    trackEvent('rsvp_code_lookup_submit');

    const trimmed = code.trim().toUpperCase();
    if (!CODE_FORMAT.test(trimmed)) {
      trackEvent('rsvp_code_validation_error', {
        failure_code: 'invalid_code_format',
        failure_message: 'Invalid RSVP code format',
      });

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
        trackEvent('rsvp_code_not_found', {
          failure_code: 'not_found_error',
          failure_message: 'RSVP ' + cleaned + ' not found',
        });
        setError(GENERIC_ERROR_MESSAGE);
      } else {
        const data = snap.data();
        if (data.rsvpDeadline.toDate() < new Date()) {
          // Track deadline passed error
          trackEvent('rsvp_code_deadline_passed', {
            failure_code: 'rsvp_deadline_passed',
            failure_message: 'RSVP ' + cleaned + ' deadline passed',
          });
          setError(RSVP_DEADLINE_PASSED_ERROR_MESSAGE);
        } else {
          // Track successful lookup
          trackEvent('rsvp_code_lookup_success');
          onSuccess(snap);
        }
      }
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };

      if (firebaseError.code === 'unavailable') {
        // Track service unavailable error with Firebase details
        trackEvent('rsvp_code_firebase_service_error', {
          failure_code: firebaseError.code,
          failure_message: firebaseError.message,
        });
        setError(RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE);
      } else {
        // Track other Firebase errors with Firebase details
        trackEvent('rsvp_code_firebase_error', {
          failure_code: firebaseError.code,
          failure_message: firebaseError.message,
        });
        setError(GENERIC_ERROR_MESSAGE);
      }
    }

    setLoading(false);
  };

  return (
    <>
      <RsvpHeader />
      <form onSubmit={handleSubmit}>
        <div className="flex items-center justify-between">
          <label
            htmlFor="rsvpCode"
            className="text-xl font-semibold mb-2 block"
          >
            Enter your RSVP code
          </label>
        </div>
        <input
          type="text"
          id="rsvpCode"
          value={code}
          onChange={e => setCode(e.target.value)}
          placeholder="Example: XXXX-XXXX"
          className="w-full p-2 border rounded bg-white focus:outline-none focus:ring mb-2"
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

        {onBackToMethodSelection ? (
          <p className="text-sm ">
            If you can't find your code, try{' '}
            <span
              role="button"
              onClick={onBackToMethodSelection}
              className="cursor-pointer underline hover:no-underline"
            >
              searching by name
            </span>
            , or email us at{' '}
            <a
              className="underline focus:outline-none focus:ring hover:no-underline"
              href="mailto:wedding@delgaudio.dev"
            >
              wedding@delgaudio.dev
            </a>
            .
          </p>
        ) : (
          <p>
            Questions? Email us at{' '}
            <a
              className="underline focus:outline-none focus:ring hover:no-underline"
              href="mailto:wedding@delgaudio.dev"
            >
              wedding@delgaudio.dev
            </a>
          </p>
        )}

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
