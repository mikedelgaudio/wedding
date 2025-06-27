import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
} from 'firebase/firestore';
import { useState, type FormEvent } from 'react';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';

const attendanceOptions = ['Yes', 'No'];

interface RsvpFormProps {
  snapshot: DocumentSnapshot<IRSVPDoc>;
}

type GuestResponse = {
  name: string;
  attending: boolean | null;
  dietaryRestrictions: string;
};

export function RsvpForm({ snapshot }: RsvpFormProps) {
  const data = snapshot.data()!;
  const deadlineDate = data.rsvpDeadline.toDate();
  const hasDeadlinePassed = new Date() > deadlineDate;

  // Invitee state: null until chosen
  const [isAttending, setIsAttending] = useState<boolean | null>(
    data.invitee.attending ?? null,
  );
  const [dietNotes, setDietNotes] = useState<string>(
    data.invitee.dietaryRestrictions ?? '',
  );

  // Guests state
  const [guestResponses, setGuestResponses] = useState<GuestResponse[]>(
    data.guests.map(g => ({
      name: g.name ?? '',
      attending: g.attending ?? null,
      dietaryRestrictions: g.dietaryRestrictions ?? '',
    })),
  );

  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState(false);

  function handleGuestResponseChange<K extends keyof GuestResponse>(
    index: number,
    field: K,
    value: GuestResponse[K],
  ) {
    setGuestResponses(prev =>
      prev.map((resp, i) => (i === index ? { ...resp, [field]: value } : resp)),
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

    // Validate invitee choice
    if (isAttending === null) {
      setErrorMessage('Please select Yes or No for your attendance.');
      return;
    }
    // Validate each guest
    for (let i = 0; i < guestResponses.length; i++) {
      const resp = guestResponses[i];
      if (!resp.name.trim()) {
        setErrorMessage(`Please enter a name for Guest ${i + 1}.`);
        return;
      }
      if (resp.attending === null) {
        setErrorMessage(`Please select Yes or No for Guest ${i + 1}.`);
        return;
      }
    }

    setIsSaving(true);
    try {
      const payload: Partial<IRSVPDoc> & { lastModified: any } = {
        invitee: {
          name: data.invitee.name,
          attending: isAttending,
          dietaryRestrictions: dietNotes || null,
        },
        guests: guestResponses.map<IGuest>(resp => ({
          name: resp.name,
          attending: resp.attending as boolean,
          dietaryRestrictions: resp.dietaryRestrictions || null,
        })),
        lastModified: serverTimestamp(),
      };

      const ref = doc(db, 'rsvp', snapshot.id);
      await updateDoc(ref, payload);

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
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-describedby={errorMessage ? 'form-error' : undefined}
    >
      {/* Header */}
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold m-0">
          Welcome, {data.invitee.name}
        </h2>
        <p className="text-gray-600">
          Please respond by <strong>{deadlineDate.toLocaleString()}</strong>.
        </p>
        {hasDeadlinePassed && (
          <p className="text-red-500">
            The RSVP deadline has passed. The form is now read-only.
          </p>
        )}
      </div>

      {/* Invitee Section */}
      <fieldset
        disabled={hasDeadlinePassed}
        className="space-y-4 border p-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <legend className="font-medium m-0">Your Response</legend>

        <div className="flex items-center gap-6">
          <p className="font-medium">
            Will you be attending? <span className="text-red-600">*</span>
          </p>
          <div className="flex items-center gap-6">
            {attendanceOptions.map(label => {
              const value = label === 'Yes';
              return (
                <label
                  key={label}
                  className="flex items-center cursor-pointer m-0"
                >
                  <input
                    type="radio"
                    name="inviteeAttending"
                    value={String(value)}
                    checked={isAttending === value}
                    onChange={() => setIsAttending(value)}
                    required
                    aria-required="true"
                    disabled={hasDeadlinePassed}
                    className="sr-only peer"
                  />
                  <span
                    className={`
                    w-5 h-5 flex-shrink-0
                    border-2 rounded-full
                    border-gray-300 peer-checked:border-stone-600
                    peer-checked:bg-stone-600
                    peer-disabled:border-gray-200 peer-disabled:bg-gray-100
                    transition
                  `}
                  />
                  <span className="ml-2 select-none">{label}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block mb-1 font-medium">Dietary Restrictions</label>
          <input
            type="text"
            value={dietNotes}
            onChange={e => setDietNotes(e.target.value)}
            placeholder="e.g. Vegetarian, Gluten-free…"
            disabled={hasDeadlinePassed}
            className="w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
          />
        </div>
      </fieldset>

      {/* Additional Guests */}
      {guestResponses.map((resp, idx) => (
        <fieldset
          key={idx}
          disabled={hasDeadlinePassed}
          className="space-y-4 border p-4 rounded disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <legend className="font-medium m-0">Guest {idx + 1}</legend>

          <div>
            <label className="block mb-1 font-medium">
              Guest {idx + 1} Full Name <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={resp.name}
              onChange={e =>
                handleGuestResponseChange(idx, 'name', e.target.value)
              }
              placeholder={`Guest ${idx + 1} Full Name`}
              required
              aria-required="true"
              disabled={hasDeadlinePassed}
              className="w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <div className="flex items-center gap-6">
            <p className="font-medium">
              Will they be attending? <span className="text-red-600">*</span>
            </p>
            <div className="flex items-center gap-6">
              {attendanceOptions.map(label => {
                const value = label === 'Yes';
                return (
                  <label
                    key={label}
                    className="flex items-center cursor-pointer m-0"
                  >
                    <input
                      type="radio"
                      name={`guestAttending-${idx}`}
                      value={String(value)}
                      checked={resp.attending === value}
                      onChange={() =>
                        handleGuestResponseChange(idx, 'attending', value)
                      }
                      required
                      aria-required="true"
                      disabled={hasDeadlinePassed}
                      className="sr-only peer"
                    />
                    <span
                      className={`
                      w-5 h-5 flex-shrink-0
                      border-2 rounded-full
                      border-gray-300 peer-checked:border-stone-600
                      peer-checked:bg-stone-600
                      peer-disabled:border-gray-200 peer-disabled:bg-gray-100
                      transition
                    `}
                    />
                    <span className="ml-2 select-none">{label}</span>
                  </label>
                );
              })}
            </div>
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
              disabled={hasDeadlinePassed}
              className="w-full p-2 border rounded focus:outline-none focus:ring disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>
        </fieldset>
      ))}

      {errorMessage && (
        <p id="form-error" role="alert" className="text-red-500">
          {errorMessage}
        </p>
      )}
      {successMessage && (
        <p className="text-stone-600">Your RSVP has been saved. Thank you!</p>
      )}

      <button
        type="submit"
        disabled={isSaving || hasDeadlinePassed}
        className="w-full bg-stone-900 cursor-pointer text-white py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSaving ? 'Saving…' : 'Submit RSVP'}
      </button>
    </form>
  );
}
