// src/components/rsvp/RsvpSignIn.tsx
import { doc, getDoc, type DocumentSnapshot } from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';

const GENERIC_ERROR_MESSAGE =
  "We couldn't find or access your invitation. Please check your code and try again, or contact us if you need help.";

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

    const trimmed = code.trim().toUpperCase();
    if (!CODE_FORMAT.test(trimmed)) {
      setError('Please enter your code in the format of XXXX-XXXX');
      setLoading(false);
      return;
    }

    const cleaned = trimmed.replace(/-/g, '');

    try {
      const ref = doc(db, 'rsvp', cleaned);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        setError(GENERIC_ERROR_MESSAGE);
      } else {
        const data = snap.data() as IRSVPDoc;
        if (data.rsvpDeadline.toDate() < new Date()) {
          setError(GENERIC_ERROR_MESSAGE);
        } else {
          onSuccess(snap);
        }
      }
    } catch (err) {
      console.error(err);
      setError(GENERIC_ERROR_MESSAGE);
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="rsvpCode" className="text-xl font-semibold mb-4 block">
        Enter your RSVP code
      </label>
      <input
        type="text"
        id="rsvpCode"
        value={code}
        onChange={e => setCode(e.target.value)}
        placeholder="Example: XXXX-XXXX"
        className="w-full p-2 border rounded focus:outline-none focus:ring mb-3"
        aria-invalid={!!error}
        aria-describedby={error ? 'rsvp-error' : undefined}
      />
      {error && (
        <p id="rsvp-error" role="alert" className="text-red-500 mb-3">
          {error}
        </p>
      )}
      <p className="text-sm">
        The RSVP code is on your invitation in the format{' '}
        <strong>XXXX-XXXX</strong>.
      </p>
      <p className="text-sm ">
        Questions?{' '}
        <a
          className="underline hover:no-underline"
          href="mailto:rsvp@delgaudio.dev"
        >
          Contact us
        </a>
      </p>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white mt-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking…' : 'Lookup'}
      </button>
    </form>
  );
}
