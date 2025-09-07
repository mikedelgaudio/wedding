import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import { useEffect, useMemo, useState, type FormEvent } from 'react';
import { db } from '../../firebase/firebase.service';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import {
  trackRsvpFormLoaded,
  trackRsvpFormSubmit,
  trackRsvpSaveError,
  trackRsvpSaveSuccess,
} from '../../utils/analytics';
import { PersonFieldset } from './PersonFieldset';
import { SuccessScreen } from './SuccessScreen';
import { isValidFoodOption, type FoodOptionId } from './utils/foodOptions';
import { validateRsvpForm } from './utils/validateRsvpForm';

interface RsvpFormProps {
  snapshot: DocumentSnapshot<IRSVPDoc>;
}

export function RsvpForm({ snapshot }: RsvpFormProps) {
  const data = snapshot.data();

  if (!data) {
    alert('No RSVP data found');
    throw new Error('No RSVP data found');
  }

  // Normalize guests early - convert null/undefined to empty array
  const normalizedGuests = useMemo((): IGuest[] => {
    if (
      !data.guests ||
      !Array.isArray(data.guests) ||
      data.guests.length === 0
    ) {
      return [];
    }
    return data.guests.map(g => {
      const foodOption = g.foodOption ?? null;
      return {
        name: g.name ?? '',
        attendingCeremony: g.attendingCeremony ?? null,
        attendingReception: g.attendingReception ?? null,
        attendingBrunch: g.attendingBrunch ?? null,
        allowedToAttendBrunch: g.allowedToAttendBrunch ?? false,
        dietaryRestrictions: g.dietaryRestrictions ?? '',
        isNameEditable: g.isNameEditable ?? false,
        foodOption: isValidFoodOption(foodOption) ? foodOption : null,
        contactInfo: g.contactInfo ?? '',
      };
    });
  }, [data.guests]);

  // Local state - initialize directly from data
  const [attendingCeremony, setAttendingCeremony] = useState<boolean | null>(
    data.invitee.attendingCeremony ?? null,
  );
  const [attendingReception, setAttendingReception] = useState<boolean | null>(
    data.invitee.attendingReception ?? null,
  );
  const [attendingBrunch, setAttendingBrunch] = useState<boolean | null>(
    data.invitee.attendingBrunch ?? null,
  );
  const [dietNotes, setDietNotes] = useState<string>(
    data.invitee.dietaryRestrictions ?? '',
  );
  const [foodOption, setFoodOption] = useState<FoodOptionId | null>(() => {
    const option = data.invitee.foodOption ?? null;
    return isValidFoodOption(option) ? option : null;
  });
  const [contactInfo, setContactInfo] = useState<string>(
    data.invitee.contactInfo ?? '',
  );
  const [guestResponses, setGuestResponses] =
    useState<IGuest[]>(normalizedGuests);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successFlag, setSuccessFlag] = useState(false);

  useEffect(() => {
    trackRsvpFormLoaded();
  }, []);

  // Date formatting and button text
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

  /**
   * Updates a specific field for a guest at the given index.
   * Uses TypeScript generics to ensure type safety between field name and value.
   *
   * @param idx - Index of the guest in the guestResponses array
   * @param field - The field name to update (e.g., 'attendingCeremony', 'foodOption')
   * @param value - The new value for the field (type-checked against the field)
   */
  function handleGuestChange<K extends keyof IGuest>(
    idx: number,
    field: K,
    value: IGuest[K],
  ) {
    // Immutably update the guest array - replace only the guest at the target index
    setGuestResponses(prev =>
      prev.map(
        (guest, index) =>
          index === idx
            ? { ...guest, [field]: value } // Spread existing guest data, override the specific field
            : guest, // Keep other guests unchanged
      ),
    );
  }

  function validate(): string | undefined {
    return validateRsvpForm({
      attendingCeremony,
      attendingReception,
      attendingBrunch,
      foodOption,
      contactInfo,
      guestResponses,
      inviteeAllowedToAttendBrunch: !!data?.invitee.allowedToAttendBrunch,
    });
  }

  function makePayload(): UpdateData<IRSVPDoc> {
    const payload: UpdateData<IRSVPDoc> = {
      invitee: {
        name: data?.invitee.name,
        attendingCeremony,
        attendingReception,
        attendingBrunch,
        dietaryRestrictions: dietNotes || null,
        foodOption: attendingReception ? foodOption : null,
        contactInfo:
          attendingCeremony || attendingReception || attendingBrunch
            ? contactInfo || null
            : null,
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
        foodOption: g.attendingReception ? g.foodOption : null,
        contactInfo:
          g.attendingCeremony || g.attendingReception || g.attendingBrunch
            ? g.contactInfo || null
            : null,
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
      const ref = doc(db, 'rsvp', snapshot.id);
      await updateDoc(ref, makePayload());

      setSuccessFlag(true);
      trackRsvpSaveSuccess();
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      trackRsvpSaveError(
        'firebase_error',
        firebaseError.code,
        firebaseError.message,
      );
      setErrorMessage(
        'An error occurred while saving your RSVP. Please refresh the page and try again or contact us.',
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
      <div className="space-y-2 bg-flax-smoke-700 shadow text-white p-6 rounded">
        <h2 className="text-4xl font-semibold m-0 break-all flex items-baseline gap-0.5 flex-wrap mb-2">
          {data.invitee.name}{' '}
          {guestResponses.length > 0 ? (
            <span className="text-lg">
              and {guestResponses.length} guest
              {guestResponses.length > 1 ? 's' : ''}
            </span>
          ) : null}
        </h2>
        {lastModifiedDate ? (
          <p className="text-xl">
            Your RSVP was last modified on{' '}
            <strong>{formatter.format(lastModifiedDate)}</strong>.
          </p>
        ) : (
          <p className="text-xl">
            Please respond by <strong>{formatter.format(deadlineDate)}</strong>.
          </p>
        )}
        <p>
          All additional guests are indicated on this RSVP or shared directly
          with other guests. If you have any questions about your RSVP, please
          reach out to us at{' '}
          <a
            className="underline hover:no-underline"
            href="mailto:wedding@delgaudio.dev"
          >
            wedding@delgaudio.dev
          </a>
          .
        </p>
      </div>

      <PersonFieldset
        person={{
          name: data.invitee.name,
          attendingCeremony,
          attendingReception,
          attendingBrunch,
          dietaryRestrictions: dietNotes,
          foodOption,
          contactInfo,
          isNameEditable: false,
          allowedToAttendBrunch: !!data.invitee.allowedToAttendBrunch,
        }}
        onPersonChange={{
          attendingCeremony: setAttendingCeremony,
          attendingReception: setAttendingReception,
          attendingBrunch: setAttendingBrunch,
          dietaryRestrictions: setDietNotes,
          foodOption: setFoodOption,
          contactInfo: setContactInfo,
          name: () => {}, // Invitee name is not editable
        }}
        personType="invitee"
      />

      {/* Only render guest sections if there are guests */}
      {guestResponses.length > 0 &&
        guestResponses.map((resp, idx) => (
          <PersonFieldset
            key={idx}
            person={{
              name: resp.name,
              attendingCeremony: resp.attendingCeremony,
              attendingReception: resp.attendingReception,
              attendingBrunch: resp.attendingBrunch,
              dietaryRestrictions: resp.dietaryRestrictions ?? '',
              foodOption: (() => {
                const option = resp.foodOption ?? null;
                return isValidFoodOption(option) ? option : null;
              })(),
              contactInfo: resp.contactInfo ?? '',
              isNameEditable: resp.isNameEditable,
              allowedToAttendBrunch: resp.allowedToAttendBrunch,
            }}
            onPersonChange={{
              attendingCeremony: value =>
                handleGuestChange(idx, 'attendingCeremony', value),
              attendingReception: value =>
                handleGuestChange(idx, 'attendingReception', value),
              attendingBrunch: value =>
                handleGuestChange(idx, 'attendingBrunch', value),
              dietaryRestrictions: value =>
                handleGuestChange(idx, 'dietaryRestrictions', value),
              foodOption: value => handleGuestChange(idx, 'foodOption', value),
              contactInfo: value =>
                handleGuestChange(idx, 'contactInfo', value),
              name: value => handleGuestChange(idx, 'name', value),
            }}
            personType="guest"
            guestNumber={idx + 1}
          />
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
