import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import { Fragment, useMemo, useRef, useState, type FormEvent } from 'react';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';
import { RadioGroup } from './RadioGroup';
import { SuccessScreen } from './SuccessScreen';

interface RsvpFormProps {
  snapshot: DocumentSnapshot<IRSVPDoc>;
}

export function RsvpForm({ snapshot }: RsvpFormProps) {
  const data = snapshot.data()!;

  // 1) Keep originals in refs
  const initialInviteeRef = useRef({
    attending: data.invitee.attending ?? null,
    dietaryRestrictions: data.invitee.dietaryRestrictions ?? '',
  });
  const initialGuestsRef = useRef<IGuest[]>(
    data.guests.map(g => ({
      name: g.name ?? '',
      attending: g.attending ?? null,
      dietaryRestrictions: g.dietaryRestrictions ?? '',
      isNameEditable: g.isNameEditable ?? false,
    })),
  );

  // 2) Local state
  const [isAttending, setIsAttending] = useState<boolean | null>(
    initialInviteeRef.current.attending,
  );
  const [dietNotes, setDietNotes] = useState<string>(
    initialInviteeRef.current.dietaryRestrictions,
  );
  const [guestResponses, setGuestResponses] = useState<IGuest[]>(
    initialGuestsRef.current,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successFlag, setSuccessFlag] = useState(false);

  // 3) Dates, formatter, button text, deadline flag
  const { deadlineDate, lastModifiedDate, formatter, saveButtonText } =
    useMemo(() => {
      const deadlineDate = data.rsvpDeadline.toDate();
      const lastModifiedDate = data.lastModified?.toDate() ?? null;
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        dateStyle: 'medium',
        timeStyle: 'short',
      });
      const saveButtonText = lastModifiedDate ? 'Update RSVP' : 'Submit RSVP';
      return {
        deadlineDate,
        lastModifiedDate,
        formatter,
        saveButtonText,
      };
    }, [data.rsvpDeadline, data.lastModified]);

  // 4) Compute "dirty"
  const origInvitee = initialInviteeRef.current;
  const origGuests = initialGuestsRef.current;
  const isDirty =
    isAttending !== origInvitee.attending ||
    dietNotes !== origInvitee.dietaryRestrictions ||
    guestResponses.length !== origGuests.length ||
    guestResponses.some((cur, i) => {
      const orig = origGuests[i]!;
      return (
        cur.name !== orig.name ||
        cur.attending !== orig.attending ||
        cur.dietaryRestrictions !== orig.dietaryRestrictions
      );
    });

  function handleGuestChange<K extends keyof IGuest>(
    idx: number,
    field: K,
    value: IGuest[K],
  ) {
    setGuestResponses(prev =>
      prev.map((g, i) => (i === idx ? { ...g, [field]: value } : g)),
    );
  }

  function validate(): string | undefined {
    if (isAttending == null) {
      return 'Please select Yes or No for your attendance.';
    }
    for (let i = 0; i < guestResponses.length; i++) {
      const g = guestResponses[i]!;
      if (!g.name?.trim()) {
        return `Please enter a name for Guest ${i + 1}.`;
      }
      if (g.attending == null) {
        return `Please select Yes or No for Guest ${i + 1}.`;
      }
    }
  }

  function makePayload(): UpdateData<IRSVPDoc> {
    return {
      invitee: {
        name: data.invitee.name,
        attending: isAttending,
        dietaryRestrictions: dietNotes || null,
      },
      guests: guestResponses.map<IGuest>(g => ({
        name: g.name,
        attending: g.attending as boolean,
        dietaryRestrictions: g.dietaryRestrictions || null,
        isNameEditable: g.isNameEditable,
      })),
      lastModified: serverTimestamp(),
    };
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setErrorMessage(null);

    if (!isDirty) {
      setErrorMessage('No changes detected—nothing to update.');
      return;
    }

    const err = validate();
    if (err) {
      setErrorMessage(err);
      return;
    }

    setIsSaving(true);
    try {
      const ref = doc(db, 'rsvp', snapshot.id);
      await updateDoc(ref, makePayload());

      // 5) Reset “original” refs to the just-saved values
      initialInviteeRef.current = {
        attending: isAttending,
        dietaryRestrictions: dietNotes,
      };
      initialGuestsRef.current = guestResponses.map(g => ({ ...g }));

      // swap to success screen
      setSuccessFlag(true);
    } catch (err) {
      console.error('RSVP save error:', err);
      setErrorMessage(
        'An error occurred while saving your RSVP. Please try again or contact us.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  // component swap on success
  if (successFlag) {
    return <SuccessScreen />;
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
        {lastModifiedDate ? (
          <p className="text-gray-600">
            Your RSVP was last modified on{' '}
            <strong>{formatter.format(lastModifiedDate)} PDT</strong>.
          </p>
        ) : (
          <p className="text-gray-600">
            Please respond by{' '}
            <strong>{formatter.format(deadlineDate)} PDT</strong>.
          </p>
        )}
      </div>

      {/* Invitee Section */}
      <fieldset className="space-y-4 border p-4 rounded">
        <legend className="font-medium m-0">Your Response</legend>
        <p className="text-xl font-bold">{data.invitee.name}</p>
        <div className="grid md:grid-cols-2 items-center gap-2">
          <p className="font-medium">
            Will you be attending? <span className="text-red-600">*</span>
          </p>
          <RadioGroup
            name="inviteeAttending"
            value={isAttending}
            onChange={setIsAttending}
            required
          />
        </div>
        <div>
          <label
            className="block mb-1 font-medium"
            htmlFor="dietaryRestrictions-invitee"
          >
            Dietary Restrictions
          </label>
          <input
            type="text"
            value={dietNotes}
            id="dietaryRestrictions-invitee"
            onChange={e => setDietNotes(e.target.value)}
            placeholder="e.g. Vegetarian, Gluten-free…"
            className="w-full p-2 border rounded focus:outline-none focus:ring"
          />
        </div>
      </fieldset>

      {/* Guests */}
      {guestResponses.map((resp, idx) => (
        <fieldset key={idx} className="space-y-4 border p-4 rounded">
          <legend className="font-medium m-0">Guest {idx + 1}</legend>
          <div>
            {resp.isNameEditable ? (
              <Fragment>
                <label
                  htmlFor={`guestName-${idx}`}
                  className="block mb-1 font-medium"
                >
                  Guest {idx + 1} Full Name{' '}
                  <span className="text-red-600">*</span>
                </label>
                <input
                  id={`guestName-${idx}`}
                  type="text"
                  value={resp.name ?? ''}
                  onChange={e => handleGuestChange(idx, 'name', e.target.value)}
                  placeholder={`Guest ${idx + 1} Full Name`}
                  required
                  className="w-full p-2 border rounded focus:outline-none focus:ring"
                />
              </Fragment>
            ) : (
              <p className="text-xl font-bold">{resp.name}</p>
            )}
          </div>
          <div className="grid md:grid-cols-2 items-center gap-2">
            <p className="font-medium">
              Will they be attending? <span className="text-red-600">*</span>
            </p>
            <RadioGroup
              name={`guestAttending-${idx}`}
              value={resp.attending}
              onChange={v => handleGuestChange(idx, 'attending', v)}
              required
            />
          </div>
          <div>
            <label
              className="block mb-1 font-medium"
              htmlFor={`dietaryRestrictions-${idx}`}
            >
              Dietary Restrictions
            </label>
            <input
              id={`dietaryRestrictions-${idx}`}
              type="text"
              value={resp.dietaryRestrictions ?? ''}
              onChange={e =>
                handleGuestChange(idx, 'dietaryRestrictions', e.target.value)
              }
              placeholder="e.g. Vegetarian, Gluten-free…"
              className="w-full p-2 border rounded focus:outline-none focus:ring"
            />
          </div>
        </fieldset>
      ))}

      {errorMessage && (
        <p id="form-error" role="alert" className="text-red-500">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={isSaving || !isDirty}
        className="w-full cursor-pointer bg-stone-900 text-white py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-6 focus-visible:outline-stone-900"
      >
        {isSaving ? 'Saving…' : saveButtonText}
      </button>
    </form>
  );
}
