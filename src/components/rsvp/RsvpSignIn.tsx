import {
  collection,
  getDocs,
  query,
  where,
  type CollectionReference,
  type QueryDocumentSnapshot,
} from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';

// before you even hit Firestore
const CODE_FORMAT = /^[A-Z0-9]{4}-[A-Z0-9]{4}$/;

interface RsvpSignInProps {
  onSuccess: (snap: QueryDocumentSnapshot<IRSVPDoc>) => void;
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
      const rsvpCollection = collection(
        db,
        'rsvp',
      ) as CollectionReference<IRSVPDoc>;
      const q = query(rsvpCollection, where('inviteCode', '==', cleaned));
      const snap = await getDocs(q);

      if (snap.empty) {
        setError(
          "1We couldn't find or access your invitation. Please check your code and try again, or contact us if you need help.",
        );
      } else {
        const docSnap = snap.docs[0];
        console.log(`Found RSVP doc: ${docSnap.id}`, docSnap.data());
        const deadline = docSnap.data().rsvpDeadline.toDate();
        if (deadline < new Date()) {
          setError('RSVP is closed for this invitation.');
        } else {
          onSuccess(docSnap);
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        "We couldn't find or access your invitation. Please check your code and try again, or contact us if you need help.",
      );
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label htmlFor="rsvpCode" className="text-xl font-semibold mb-4">
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

      <p>
        The RSVP code is located on your invitation in the format of{' '}
        <strong>XXXX-XXXX</strong>.
      </p>
      <p>
        Questions?{' '}
        <a
          className="underline hover:no-underline"
          href="mailto:rsvp@delgaudio.dev"
        >
          Contact us.
        </a>
      </p>

      <button
        type="submit"
        disabled={loading}
        className="w-full cursor-pointer mt-6 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'Checking…' : 'Lookup'}
      </button>
    </form>
  );
}
