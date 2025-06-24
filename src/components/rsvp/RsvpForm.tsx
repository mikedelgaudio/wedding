// src/components/rsvp/RsvpForm.tsx
import type { DocumentSnapshot } from 'firebase/firestore';
import { doc, updateDoc } from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';

interface RsvpFormProps {
  snapshot: DocumentSnapshot<IRSVPDoc>;
}

type GuestResponse = {
  name: string;
  attending: boolean;
  dietaryRestrictions: string;
};

export function RsvpForm({ snapshot }: RsvpFormProps) {
  const data = snapshot.data()!;
  const deadline = data.rsvpDeadline.toDate();
  const hasDeadlinePassed = new Date() > deadline;

  // Invitee state
  const [isAttending, setIsAttending] = useState<boolean>(
    data.invitee.attending ?? false,
  );
  const [dietNotes, setDietNotes] = useState<string>(
    data.invitee.dietaryRestrictions ?? '',
  );

  // Additional guests state
  const [guestResponses, setGuestResponses] = useState<GuestResponse[]>(
    data.guests.map(guest => ({
      name: guest.name ?? '',
      attending: guest.attending ?? false,
      dietaryRestrictions: guest.dietaryRestrictions ?? '',
    })),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  // Update a single guest’s response
  function handleGuestResponseChange(
    guestIndex: number,
    field: keyof GuestResponse,
    newValue: GuestResponse[typeof field],
  ) {
    setGuestResponses(previous =>
      previous.map((response, idx) =>
        idx === guestIndex ? { ...response, [field]: newValue } : response,
      ),
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (hasDeadlinePassed) {
      setErrorMessage(
        'The RSVP deadline has passed. Please contact us if you need to update.',
      );
      return;
    }

    setIsSaving(true);
    try {
      const updatePayload: Partial<IRSVPDoc> = {
        invitee: {
          name: data.invitee.name,
          attending: isAttending,
          dietaryRestrictions: dietNotes || null,
        },
        guests: guestResponses.map<IGuest>(resp => ({
          name: resp.name || null,
          attending: resp.attending,
          dietaryRestrictions: resp.dietaryRestrictions || null,
        })),
      };

      const ref = doc(db, 'rsvp', snapshot.id);
      await updateDoc(ref, updatePayload);

      setSuccessMessage(true);
    } catch (err) {
      console.error('RSVP save error:', err);
      setErrorMessage(
        'An error occurred while saving your RSVP. Please try again or contact us.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold m-0">
          Welcome {data.invitee.name}
        </h2>
        <p className="text-gray-600">
          Your RSVP deadline is <strong>{deadline.toLocaleString()}</strong>.
        </p>
        {hasDeadlinePassed && (
          <p className="text-red-500">
            The RSVP deadline has passed. The form is read-only.
          </p>
        )}
      </div>

      {/* Invitee Section */}
      <fieldset
        disabled={hasDeadlinePassed}
        className="space-y-2 border p-4 rounded disabled:opacity-75 disabled:cursor-not-allowed"
      >
        <legend className="font-medium m-0">Your Response</legend>
        <div className="flex items-center space-x-4">
          <p>Will you be attending?</p>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="attending"
              checked={isAttending}
              onChange={() => setIsAttending(true)}
              className="form-radio disabled:cursor-not-allowed"
            />
            <span>Yes</span>
          </label>
          <label className="flex items-center space-x-1">
            <input
              type="radio"
              name="attending"
              checked={!isAttending}
              onChange={() => setIsAttending(false)}
              className="form-radio disabled:cursor-not-allowed"
            />
            <span>No</span>
          </label>
        </div>
        <div>
          <label className="block mb-1 font-medium">Dietary Restrictions</label>
          <input
            type="text"
            value={dietNotes}
            onChange={e => setDietNotes(e.target.value)}
            placeholder="e.g. Vegetarian, Gluten-free…"
            className="w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-75 disabled:cursor-not-allowed"
          />
        </div>
      </fieldset>

      {/* Additional Guests */}
      {guestResponses.map((resp, idx) => (
        <fieldset
          key={idx}
          disabled={hasDeadlinePassed}
          className="space-y-2 border p-4 rounded disabled:opacity-75 disabled:cursor-not-allowed"
        >
          <legend className="font-medium m-0">Guest {idx + 1}</legend>
          <div>
            <label className="block mb-1 font-medium">
              Guest {idx + 1} Full Name
            </label>
            <input
              type="text"
              value={resp.name}
              onChange={e =>
                handleGuestResponseChange(idx, 'name', e.target.value)
              }
              placeholder={`${`Guest ${idx + 1} Full Name`}`}
              className="w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
          <div className="flex items-center space-x-4">
            <p>Will they be attending?</p>

            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name={`guestAttending-${idx}`}
                checked={resp.attending}
                onChange={() =>
                  handleGuestResponseChange(idx, 'attending', true)
                }
                className="form-radio disabled:cursor-not-allowed"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center space-x-1">
              <input
                type="radio"
                name={`guestAttending-${idx}`}
                checked={!resp.attending}
                onChange={() =>
                  handleGuestResponseChange(idx, 'attending', false)
                }
                className="form-radio disabled:cursor-not-allowed"
              />
              <span>No</span>
            </label>
          </div>
          <div>
            <label className="block mb-1 font-medium">
              Dietary Restrictions
            </label>
            <input
              type="text"
              value={resp.dietaryRestrictions}
              onChange={e =>
                handleGuestResponseChange(
                  idx,
                  'dietaryRestrictions',
                  e.target.value,
                )
              }
              placeholder="e.g. None, Vegan…"
              className="w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-75 disabled:cursor-not-allowed"
            />
          </div>
        </fieldset>
      ))}

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {successMessage && (
        <p className="text-green-600">Your RSVP has been saved. Thank you!</p>
      )}

      <button
        type="submit"
        disabled={isSaving || hasDeadlinePassed}
        className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving…' : 'Submit RSVP'}
      </button>
    </form>
  );
}
