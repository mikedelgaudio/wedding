import {
  collection,
  getDocs,
  query,
  where,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IRSVPDoc } from '../../../firebase/IRSVPDoc';
import { db } from '../../../firebase/firebase.service';
import {
  trackRsvpError,
  trackRsvpFormLookupSubmit,
} from '../../../utils/analytics';
import { RsvpHeader } from '../RsvpHeader';
import type { IRsvpScreenProps } from '../models/IRsvpScreenProps';
import { calculateMatchScore } from '../utils/calculateMatchWord';

const MAX_MATCHES = 10;
const MIN_SCORE_THRESHOLD = 0.25;

const RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE =
  'The RSVP service is currently unavailable. Please try again later or contact us for assistance.';

const GENERIC_ERROR_MESSAGE =
  "We couldn't find your invitation. Please check your name and try again, or use the RSVP code on your invitation.";

interface NameMatch {
  snapshot: DocumentSnapshot<IRSVPDoc>;
  displayName: string;
  matchScore: number;
}

interface RsvpNameLookupProps extends IRsvpScreenProps {
  onNamesFound: (matches: NameMatch[]) => void;
}

export function RsvpNameLookup({
  onSuccess,
  onNamesFound,
  onBackToMethodSelection,
}: RsvpNameLookupProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    trackRsvpFormLookupSubmit();

    const trimmedFirst = firstName.trim();
    const trimmedLast = lastName.trim();

    if (!trimmedFirst || !trimmedLast) {
      trackRsvpError(
        'validation_error',
        'missing_name_fields',
        'First and last name are required',
      );
      setError('Please enter both your first and last name.');
      setLoading(false);
      return;
    }

    try {
      const rsvpCollection = collection(db, 'rsvp');
      const q = query(rsvpCollection, where('rsvpDeadline', '>', new Date()));
      const querySnapshot = await getDocs(q);

      const matches: NameMatch[] = [];
      const fullSearchName = `${trimmedFirst} ${trimmedLast}`;

      // Track seen document IDs to avoid duplicates during processing
      const seenDocIds = new Set<string>();

      querySnapshot.forEach(doc => {
        const data = doc.data() as IRSVPDoc;

        // Check invitee name
        const inviteeFullScore = calculateMatchScore(
          fullSearchName,
          data.invitee.name,
        );
        const inviteeLastScore = calculateMatchScore(
          trimmedLast,
          data.invitee.name,
        );
        const inviteeScore = Math.max(inviteeFullScore, inviteeLastScore * 0.7); // Last name match gets 70% weight

        if (inviteeScore > MIN_SCORE_THRESHOLD && !seenDocIds.has(doc.id)) {
          matches.push({
            snapshot: doc as DocumentSnapshot<IRSVPDoc>,
            displayName: data.invitee.name,
            matchScore: inviteeScore,
          });
          seenDocIds.add(doc.id);
        }

        // Check guest names (only if we haven't already matched this document)
        if (
          !seenDocIds.has(doc.id) &&
          data.guests &&
          Array.isArray(data.guests)
        ) {
          let bestGuestScore = 0;
          let bestGuestName = '';

          // Find the best matching guest for this document
          data.guests.forEach(guest => {
            if (!guest.name) return;
            const guestFullScore = calculateMatchScore(
              fullSearchName,
              guest.name,
            );
            const guestLastScore = calculateMatchScore(trimmedLast, guest.name);
            const guestScore = Math.max(guestFullScore, guestLastScore * 0.7);

            if (guestScore > bestGuestScore) {
              bestGuestScore = guestScore;
              bestGuestName = guest.name;
            }
          });

          // Add the best guest match if it meets threshold
          if (bestGuestScore > MIN_SCORE_THRESHOLD) {
            matches.push({
              snapshot: doc as DocumentSnapshot<IRSVPDoc>,
              displayName: `${bestGuestName} (guest of ${data.invitee.name})`,
              matchScore: bestGuestScore,
            });
            seenDocIds.add(doc.id);
          }
        }

        // Early termination: if we have enough high-quality matches, stop processing
        if (matches.length >= MAX_MATCHES * 2) {
          const sortedMatches = matches.sort(
            (a, b) => b.matchScore - a.matchScore,
          );
          const topMatches = sortedMatches.slice(0, MAX_MATCHES);

          // If our worst "top" match is still pretty good (>0.7), we can stop early
          if (topMatches[MAX_MATCHES - 1]?.matchScore > 0.7) {
            return; // Break out of forEach early
          }
        }
      });

      // Sort by match score (highest first) and limit results
      const uniqueMatches = matches
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, MAX_MATCHES);

      if (uniqueMatches.length === 0) {
        trackRsvpError(
          'not_found_error',
          'name_not_found',
          `Name "${fullSearchName}" not found`,
        );
        setError(GENERIC_ERROR_MESSAGE);
      } else if (
        uniqueMatches.length === 1 &&
        uniqueMatches[0].matchScore === 1.0
      ) {
        // Only auto-navigate for perfect exact matches
        onSuccess(uniqueMatches[0].snapshot);
      } else {
        // Show selection screen for all other cases - let user confirm their choice
        onNamesFound(uniqueMatches);
      }
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };

      if (firebaseError.code === 'unavailable') {
        trackRsvpError(
          'firebase_service_error',
          firebaseError.code,
          firebaseError.message,
        );
        setError(RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE);
      } else {
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
      <RsvpHeader />
      <p className="text-lg mb-6">
        Please enter your first and last name as they appear on your invitation.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="text-lg font-semibold mb-2 block"
            >
              First Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="firstName"
              autoComplete="off"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="Enter your first name"
              className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
              required
            />
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="text-lg font-semibold mb-2 block"
            >
              Last Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              autoComplete="off"
              onChange={e => setLastName(e.target.value)}
              placeholder="Enter your last name"
              className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
              required
            />
          </div>
        </div>

        {error && (
          <div className="bg-red-700 font-bold text-white mb-4 p-4 rounded">
            <p id="name-error" role="alert">
              {error}
            </p>
          </div>
        )}

        <p className="text-sm text-black">
          Alternatively,{' '}
          <span
            role="button"
            onClick={onBackToMethodSelection}
            className="cursor-pointer underline hover:no-underline"
          >
            use your RSVP code
          </span>{' '}
          or email us at{' '}
          <a
            className="underline focus:outline-none focus:ring hover:no-underline"
            href="mailto:wedding@delgaudio.dev"
          >
            wedding@delgaudio.dev
          </a>{' '}
          for assistance.
        </p>

        <button
          type="submit"
          disabled={loading}
          className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-900 text-white mt-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
      </form>
    </>
  );
}

export type { NameMatch };
