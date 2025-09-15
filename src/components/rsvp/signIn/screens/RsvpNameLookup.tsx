import {
  collection,
  doc,
  getDoc,
  getDocs,
  type DocumentReference,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IRSVPDoc } from '../../../../firebase/IRSVPDoc';
import { db } from '../../../../firebase/firebase.service';
import {
  trackRsvpError,
  trackRsvpFormLookupSubmit,
  trackRsvpSuccess,
} from '../../../../utils/analytics';
import {
  GENERIC_ERROR_MESSAGE,
  RSVP_DEADLINE_PASSED_ERROR_MESSAGE,
  RSVP_SERVICE_UNAVAILABLE_ERROR_MESSAGE,
} from '../../utils/errorMessages';
import { RsvpBackButton } from '../RsvpBackButton';
import { RsvpHeader } from '../RsvpHeader';

interface NameSearchResult {
  id: string;
  name: string;
  inviteCode: string;
  score: number;
}

interface RsvpNameLookupProps {
  onSuccess: (snap: DocumentSnapshot<IRSVPDoc>) => void;
  onBack?: () => void;
}

export function RsvpNameLookup({ onSuccess, onBack }: RsvpNameLookupProps) {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<NameSearchResult[]>([]);
  const [selectedInviteId, setSelectedInviteId] = useState<string>('');
  const [loadingSelection, setLoadingSelection] = useState(false);

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setSearchResults([]);
    setSelectedInviteId('');

    // Track form submission
    trackRsvpFormLookupSubmit();

    const trimmedFirstName = firstName.trim().toLowerCase();
    const trimmedLastName = lastName.trim().toLowerCase();

    if (!trimmedFirstName || !trimmedLastName) {
      setError('Please enter both your first and last name to search.');
      setLoading(false);
      return;
    }

    try {
      // Query Firestore for RSVP documents
      // Since we can't do case-insensitive queries easily in Firestore,
      // we'll get all documents and filter them client-side for better UX
      const rsvpCollection = collection(db, 'rsvp');
      const querySnapshot = await getDocs(rsvpCollection);
      const results: NameSearchResult[] = [];

      querySnapshot.forEach(docSnap => {
        const data = docSnap.data() as IRSVPDoc;

        // Helper function to calculate name match score
        const getNameMatchScore = (fullName: string): number => {
          const nameLower = fullName.toLowerCase();
          const nameParts = nameLower.split(' ');

          let score = 0;

          // Exact first name match
          if (nameParts.some(part => part === trimmedFirstName)) {
            score += 10;
          }
          // Partial first name match
          else if (
            nameParts.some(
              part =>
                part.includes(trimmedFirstName) ||
                trimmedFirstName.includes(part),
            )
          ) {
            score += 5;
          }

          // Exact last name match
          if (nameParts.some(part => part === trimmedLastName)) {
            score += 10;
          }
          // Partial last name match
          else if (
            nameParts.some(
              part =>
                part.includes(trimmedLastName) ||
                trimmedLastName.includes(part),
            )
          ) {
            score += 5;
          }

          // Bonus for full name containing both search terms
          if (
            nameLower.includes(trimmedFirstName) &&
            nameLower.includes(trimmedLastName)
          ) {
            score += 3;
          }

          return score;
        };

        // Check invitee name
        const inviteeScore = getNameMatchScore(data.invitee.name);
        if (inviteeScore > 0) {
          results.push({
            id: docSnap.id,
            name: data.invitee.name,
            inviteCode: data.inviteCode,
            score: inviteeScore,
          });
        }

        // Also check guests if they exist
        if (data.guests) {
          data.guests.forEach(guest => {
            const guestScore = getNameMatchScore(guest.name);
            if (guestScore > 0) {
              results.push({
                id: docSnap.id,
                name: guest.name,
                inviteCode: data.inviteCode,
                score: guestScore,
              });
            }
          });
        }
      });

      // Sort results by score (highest first), then by name
      results.sort((a, b) => {
        if (b.score !== a.score) {
          return b.score - a.score;
        }
        return a.name.localeCompare(b.name);
      });

      if (results.length === 0) {
        trackRsvpError(
          'not_found_error',
          'name_not_found',
          'No RSVP found for name: ' + trimmedFirstName + ' ' + trimmedLastName,
        );
        setError(
          'No invitations found for that name. Please check the spelling and try again.',
        );
      } else {
        setSearchResults(results);
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

  const handlePersonSelection = async () => {
    if (!selectedInviteId) {
      setError('Please select a person from the list.');
      return;
    }

    setLoadingSelection(true);
    setError(null);

    try {
      const untypedRef = doc(db, 'rsvp', selectedInviteId);
      const ref = untypedRef as DocumentReference<IRSVPDoc>;
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        trackRsvpError(
          'not_found_error',
          'selected_rsvp_not_found',
          'Selected RSVP ' + selectedInviteId + ' not found',
        );
        setError(GENERIC_ERROR_MESSAGE);
      } else {
        const data = snap.data() as IRSVPDoc;
        if (data.rsvpDeadline.toDate() < new Date()) {
          trackRsvpError(
            'deadline_error',
            'rsvp_deadline_passed',
            'RSVP ' + selectedInviteId + ' deadline passed',
          );
          setError(RSVP_DEADLINE_PASSED_ERROR_MESSAGE);
        } else {
          trackRsvpSuccess();
          onSuccess(snap);
        }
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

    setLoadingSelection(false);
  };

  return (
    <>
      <RsvpHeader />
      <form onSubmit={handleSearch}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="firstName"
              className="text-lg font-semibold mb-2 block"
            >
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full p-2 border rounded bg-white focus:outline-none focus:ring mb-2"
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
            />
          </div>
          <div>
            <label
              htmlFor="lastName"
              className="text-lg font-semibold mb-2 block"
            >
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              placeholder="Smith"
              className="w-full p-2 border rounded bg-white focus:outline-none focus:ring mb-2"
              aria-invalid={!!error}
              aria-describedby={error ? 'name-error' : undefined}
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
        <p className="text-md">
          Search for your invitation by entering your first and last name.
        </p>
        <button
          type="submit"
          disabled={loading}
          className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-900 text-white mt-4 py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Searching…' : 'Search'}
        </button>
        {onBack && <RsvpBackButton onBack={onBack} />}
      </form>

      {searchResults.length > 0 && (
        <div className="mt-8">
          <h3 className="text-xl font-semibold mb-4">
            Found {searchResults.length} matching invitation
            {searchResults.length !== 1 ? 's' : ''}:
          </h3>
          <div className="space-y-3">
            {searchResults.map((result, index) => (
              <label
                key={`${result.id}-${result.name}`}
                className="flex items-center space-x-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name="selectedPerson"
                  value={result.id}
                  checked={selectedInviteId === result.id}
                  onChange={e => setSelectedInviteId(e.target.value)}
                  className="focus:ring focus:outline-none"
                />
                <div className="flex-1">
                  <span className="text-lg font-medium">{result.name}</span>
                  {index === 0 &&
                    searchResults.length > 1 &&
                    result.score > searchResults[1].score && (
                      <span className="ml-2 text-sm text-green-600 font-medium">
                        (Best match)
                      </span>
                    )}
                </div>
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={handlePersonSelection}
            disabled={!selectedInviteId || loadingSelection}
            className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-900 text-white mt-6 py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loadingSelection ? 'Loading…' : 'Continue'}
          </button>
        </div>
      )}
    </>
  );
}
