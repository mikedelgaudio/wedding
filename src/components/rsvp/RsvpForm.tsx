import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import {
  Fragment,
  useEffect,
  useMemo,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import { db } from '../../firebase/firebase.service';
import {
  trackRsvpFormLoaded,
  trackRsvpFormSubmit,
  trackRsvpSaveError,
  trackRsvpSaveSuccess,
  trackRsvpSaveSuccessNoOp,
} from '../../utils/analytics';
import { RadioGroup } from './RadioGroup';
import { SuccessScreen } from './SuccessScreen';

interface RsvpFormProps {
  snapshot: DocumentSnapshot<IRSVPDoc>;
}

export function RsvpForm({ snapshot }: RsvpFormProps) {
  const data = snapshot.data()!;

  // Normalize guests early - convert null/undefined to empty array
  const normalizedGuests = useMemo((): IGuest[] => {
    if (
      !data.guests ||
      !Array.isArray(data.guests) ||
      data.guests.length === 0
    ) {
      return [];
    }
    return data.guests.map(g => ({
      name: g.name ?? '',
      attendingCeremony: g.attendingCeremony ?? null,
      attendingReception: g.attendingReception ?? null,
      attendingBrunch: g.attendingBrunch ?? null,
      allowedToAttendBrunch: g.allowedToAttendBrunch ?? false,
      dietaryRestrictions: g.dietaryRestrictions ?? '',
      isNameEditable: g.isNameEditable ?? false,
    }));
  }, [data.guests]);

  // 1) Keep originals in refs
  const initialInviteeRef = useRef({
    attendingCeremony: data.invitee.attendingCeremony ?? null,
    attendingReception: data.invitee.attendingReception ?? null,
    attendingBrunch: data.invitee.attendingBrunch ?? null,
    dietaryRestrictions: data.invitee.dietaryRestrictions ?? '',
  });
  const initialGuestsRef = useRef<IGuest[]>(normalizedGuests);

  // 2) Local state - guests is now always an array
  const [attendingCeremony, setAttendingCeremony] = useState<boolean | null>(
    initialInviteeRef.current.attendingCeremony,
  );
  const [attendingReception, setAttendingReception] = useState<boolean | null>(
    initialInviteeRef.current.attendingReception,
  );
  const [attendingBrunch, setAttendingBrunch] = useState<boolean | null>(
    initialInviteeRef.current.attendingBrunch,
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

  useEffect(() => {
    trackRsvpFormLoaded();
  }, []);

  // 3) Dates, formatter, button text, deadline flag
  const { deadlineDate, lastModifiedDate, formatter, saveButtonText } =
    useMemo(() => {
      const deadlineDate = data.rsvpDeadline.toDate();
      const lastModifiedDate = data.lastModified?.toDate() ?? null;
      const formatter = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/Los_Angeles',
        dateStyle: 'long',
      });
      const saveButtonText = lastModifiedDate ? 'Update RSVP' : 'Submit RSVP';
      return {
        deadlineDate,
        lastModifiedDate,
        formatter,
        saveButtonText,
      };
    }, [data.rsvpDeadline, data.lastModified]);

  // 4) Compute "dirty" - now safe with guaranteed arrays
  const origInvitee = initialInviteeRef.current;
  const origGuests = initialGuestsRef.current;
  const isDirty =
    attendingCeremony !== origInvitee.attendingCeremony ||
    attendingReception !== origInvitee.attendingReception ||
    attendingBrunch !== origInvitee.attendingBrunch ||
    dietNotes !== origInvitee.dietaryRestrictions ||
    guestResponses.length !== origGuests.length ||
    guestResponses.some((cur, i) => {
      const orig = origGuests[i];
      if (!orig) return true; // Safety check - if original guest missing, consider dirty
      return (
        cur.name !== orig.name ||
        cur.attendingCeremony !== orig.attendingCeremony ||
        cur.attendingReception !== orig.attendingReception ||
        cur.attendingBrunch !== orig.attendingBrunch ||
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
    if (attendingCeremony == null) {
      return 'Please select Yes or No for ceremony attendance.';
    }
    if (attendingReception == null) {
      return 'Please select Yes or No for reception attendance.';
    }
    if (data.invitee.allowedToAttendBrunch && attendingBrunch == null) {
      return 'Please select Yes or No for brunch attendance.';
    }

    // Only validate guests if there are any
    if (guestResponses.length > 0) {
      for (let i = 0; i < guestResponses.length; i++) {
        const g = guestResponses[i];
        if (!g) continue; // Safety check

        if (g.attendingCeremony == null) {
          return `Please select Yes or No for Guest ${
            i + 1
          } ceremony attendance.`;
        }
        if (g.attendingReception == null) {
          return `Please select Yes or No for Guest ${
            i + 1
          } reception attendance.`;
        }
        if (g.allowedToAttendBrunch && g.attendingBrunch == null) {
          return `Please select Yes or No for Guest ${
            i + 1
          } brunch attendance.`;
        }
        if (
          (g.attendingCeremony || g.attendingReception || g.attendingBrunch) &&
          g.isNameEditable &&
          !g.name?.trim()
        ) {
          return `Please enter a name for Guest ${i + 1}.`;
        }
      }
    }
  }

  function makePayload(): UpdateData<IRSVPDoc> {
    const payload: UpdateData<IRSVPDoc> = {
      invitee: {
        name: data.invitee.name,
        attendingCeremony,
        attendingReception,
        attendingBrunch,
        dietaryRestrictions: dietNotes || null,
      },
      lastModified: serverTimestamp(),
    };

    // Only include guests field if there are guests
    if (guestResponses.length > 0) {
      payload.guests = guestResponses.map<
        Omit<IGuest, 'allowedToAttendBrunch'>
      >(g => ({
        name: g.name,
        attendingCeremony: g.attendingCeremony,
        attendingReception: g.attendingReception,
        attendingBrunch: g.attendingBrunch,
        dietaryRestrictions: g.dietaryRestrictions || null,
        isNameEditable: g.isNameEditable,
      }));
    } else {
      payload.guests = [];
    }
    return payload;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    trackRsvpFormSubmit();
    setErrorMessage(null);

    const err = validate();
    if (err) {
      trackRsvpSaveError('validation_error', undefined, err);
      setErrorMessage(err);
      return;
    }

    setIsSaving(true);
    try {
      if (!isDirty) {
        setSuccessFlag(true);
        trackRsvpSaveSuccessNoOp();
        return;
      }

      const ref = doc(db, 'rsvp', snapshot.id);
      await updateDoc(ref, makePayload());

      // 5) Reset "original" refs to the just-saved values
      initialInviteeRef.current = {
        attendingCeremony,
        attendingReception,
        attendingBrunch,
        dietaryRestrictions: dietNotes,
      };
      initialGuestsRef.current = [...guestResponses]; // Create new array reference

      setSuccessFlag(true);
      trackRsvpSaveSuccess();
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      console.log(err);
      trackRsvpSaveError(
        'firebase_error',
        firebaseError.code,
        firebaseError.message,
      );
      setErrorMessage(
        'An error occurred while saving your RSVP. Please try again or contact us.',
      );
    } finally {
      setIsSaving(false);
    }
  }

  if (successFlag) {
    return <SuccessScreen />;
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      aria-describedby={errorMessage ? 'form-error' : undefined}
    >
      <div className="space-y-2 bg-black text-white p-6 rounded">
        <h2 className="text-3xl font-semibold m-0 break-all">
          {data.invitee.name}{' '}
          {guestResponses.length > 0 ? (
            <span className="text-lg">
              and {guestResponses.length} guest
              {guestResponses.length > 1 ? 's' : ''}
            </span>
          ) : null}
        </h2>
        {lastModifiedDate ? (
          <p>
            Your RSVP was last modified on{' '}
            <strong>{formatter.format(lastModifiedDate)}</strong>.
          </p>
        ) : (
          <p>
            Please respond by <strong>{formatter.format(deadlineDate)}</strong>.
          </p>
        )}
        <p>
          We hope to celebrate with you! Due to venue capacity, we've planned
          for the guests listed on each invitation. If you have any questions
          about your RSVP, please reach out to us at{' '}
          <a
            className="underline hover:no-underline"
            href="mailto:wedding@delgaudio.dev"
          >
            wedding@delgaudio.dev
          </a>
          .
        </p>
      </div>

      <fieldset className="space-y-4 border p-4 rounded">
        <legend className="font-medium m-0">Your Response</legend>
        <div>
          <p className="text-xl font-bold break-all m-0">{data.invitee.name}</p>
          <p className="text-lg m-0">Will you be attending the...</p>
        </div>
        <div className="grid sm:grid-cols-2 items-center gap-2">
          <p className="font-medium">
            Ceremony? <span className="text-red-600">*</span>
          </p>
          <RadioGroup
            name="inviteeAttendingCeremony"
            value={attendingCeremony}
            onChange={setAttendingCeremony}
            required
          />
        </div>

        <div className="grid sm:grid-cols-2 items-center gap-2">
          <p className="font-medium">
            Reception? <span className="text-red-600">*</span>
          </p>
          <RadioGroup
            name="inviteeAttendingReception"
            value={attendingReception}
            onChange={setAttendingReception}
            required
          />
        </div>

        {data.invitee.allowedToAttendBrunch && (
          <div className="grid sm:grid-cols-2 items-center gap-2">
            <div className="flex flex-col">
              <p className="font-medium">
                Day After Brunch? <span className="text-red-600">*</span>
              </p>
              <p className="text-sm">
                Casual morning gathering the day after the wedding for close
                friends and family at the Archer Hotel in Redmond, WA on June
                19, 2026 at 10:00AM PDT.
              </p>
            </div>
            <RadioGroup
              name="inviteeAttendingBrunch"
              value={attendingBrunch}
              onChange={setAttendingBrunch}
              required
            />
          </div>
        )}

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

      {/* Only render guest sections if there are guests */}
      {guestResponses.length > 0 &&
        guestResponses.map((resp, idx) => (
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
                    onChange={e =>
                      handleGuestChange(idx, 'name', e.target.value)
                    }
                    placeholder={`Guest ${idx + 1} Full Name`}
                    required={
                      resp.attendingCeremony === true ||
                      resp.attendingReception === true ||
                      resp.attendingBrunch === true
                    }
                    className="w-full p-2 border rounded focus:outline-none focus:ring"
                  />
                </Fragment>
              ) : (
                <p className="text-xl font-bold break-all m-0">{resp.name}</p>
              )}
              <p className="text-lg m-0">Will they be attending the...</p>
            </div>

            <div className="grid sm:grid-cols-2 items-center gap-2">
              <p className="font-medium">
                Ceremony? <span className="text-red-600">*</span>
              </p>
              <RadioGroup
                name={`guestAttendingCeremony-${idx}`}
                value={resp.attendingCeremony}
                onChange={v => handleGuestChange(idx, 'attendingCeremony', v)}
                required
              />
            </div>

            <div className="grid sm:grid-cols-2 items-center gap-2">
              <p className="font-medium">
                Reception? <span className="text-red-600">*</span>
              </p>
              <RadioGroup
                name={`guestAttendingReception-${idx}`}
                value={resp.attendingReception}
                onChange={v => handleGuestChange(idx, 'attendingReception', v)}
                required
              />
            </div>

            {resp.allowedToAttendBrunch && (
              <div className="grid sm:grid-cols-2 items-center gap-2">
                <div className="flex flex-col">
                  <p className="font-medium">
                    Day After Brunch? <span className="text-red-600">*</span>
                  </p>
                  <p className="text-sm">
                    Casual morning gathering the day after the wedding for close
                    friends and family at the Archer Hotel in Redmond, WA on
                    June 19, 2026 at 10:00AM PDT.
                  </p>
                </div>
                <RadioGroup
                  name={`guestAttendingBrunch-${idx}`}
                  value={resp.attendingBrunch}
                  onChange={v => handleGuestChange(idx, 'attendingBrunch', v)}
                  required
                />
              </div>
            )}

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
        <div className="bg-red-700 font-bold text-white p-4 rounded">
          <p id="form-error" role="alert">
            {errorMessage}
          </p>
        </div>
      )}

      <button
        type="submit"
        disabled={isSaving}
        className="w-full cursor-pointer bg-stone-900 text-white py-2 rounded hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-6 focus-visible:outline-stone-900"
      >
        {isSaving ? 'Saving…' : saveButtonText}
      </button>
    </form>
  );
}
