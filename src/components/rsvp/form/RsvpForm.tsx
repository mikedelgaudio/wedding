import { useEffect, useMemo, type FormEvent } from 'react';
import { useRsvp } from '../../../hooks/useRsvp';
import { trackRsvpError, trackRsvpFormLoaded } from '../../../utils/analytics';
import { SuccessScreen } from '../results/SuccessScreen';
import { isValidFoodOption, type FoodOptionId } from '../utils/foodOptions';
import { PersonFieldset } from './PersonFieldset';

export function RsvpForm() {
  const { state, actions } = useRsvp();
  const { snapshot, formData, isSaving, errorMessage, successFlag } = state;

  const data = snapshot?.data();

  if (!data) {
    trackRsvpError('No RSVP data found in RsvpForm');
    throw new Error('No RSVP data found');
  }

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

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    await actions.submitRsvp();
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
          {data.invitee.name}
          {formData.guests.length > 0 ? (
            <span className="text-lg">
              {' '}
              and {formData.guests.length} guest
              {formData.guests.length > 1 ? 's' : ''}
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
          attendingCeremony: formData.attendingCeremony,
          attendingReception: formData.attendingReception,
          attendingBrunch: formData.attendingBrunch,
          dietaryRestrictions: formData.dietaryRestrictions,
          foodOption: formData.foodOption,
          contactInfo: formData.contactInfo,
          isNameEditable: false,
          allowedToAttendBrunch: !!data.invitee.allowedToAttendBrunch,
        }}
        personType="invitee"
      />

      {/* Only render guest sections if there are guests */}
      {formData.guests.length > 0 &&
        formData.guests.map((guest, idx) => (
          <PersonFieldset
            key={idx}
            person={{
              name: guest.name ?? '',
              attendingCeremony: guest.attendingCeremony,
              attendingReception: guest.attendingReception,
              attendingBrunch: guest.attendingBrunch,
              dietaryRestrictions: guest.dietaryRestrictions ?? '',
              foodOption: isValidFoodOption(guest.foodOption ?? null)
                ? (guest.foodOption as FoodOptionId)
                : null,
              contactInfo: guest.contactInfo ?? '',
              isNameEditable: guest.isNameEditable,
              allowedToAttendBrunch: guest.allowedToAttendBrunch,
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
