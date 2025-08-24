import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import { Fragment, useEffect, useMemo, useState, type FormEvent } from 'react';
import { db } from '../../firebase/firebase.service';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import {
  trackRsvpFormLoaded,
  trackRsvpFormSubmit,
  trackRsvpSaveError,
  trackRsvpSaveSuccess,
} from '../../utils/analytics';
import { OpenInExternalLink } from '../OpenInExternalLink';
import {
  FOOD_OPTIONS,
  isValidFoodOption,
  type FoodOptionId,
} from './foodOptions';
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
    if (attendingReception === true && !foodOption) {
      return 'Please select a food option for the reception dinner.';
    }
    if (foodOption === 'unknown' && !contactInfo.trim()) {
      return 'Please provide your phone number or email so we can contact you about food options.';
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
        if (g.attendingReception === true && !g.foodOption) {
          return `Please select a food option for Guest ${
            i + 1
          } reception dinner.`;
        }
        if (g.foodOption === 'unknown' && !g.contactInfo?.trim()) {
          return `Please provide contact info for Guest ${
            i + 1
          } so we can discuss food options.`;
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
        foodOption: attendingReception ? foodOption : null,
        contactInfo: (foodOption === 'unknown' ? contactInfo : '') || null,
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
        contactInfo: (g.foodOption === 'unknown' ? g.contactInfo : '') || null,
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
      <div className="space-y-2 bg-[#78805e] shadow text-white p-6 rounded">
        <h2 className="text-4xl font-semibold m-0 break-all">
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
          All plus-one guests are indicated on this RSVP or shared directly with
          other guests. If you have any questions about your RSVP, please reach
          out to us at{' '}
          <a
            className="underline hover:no-underline"
            href="mailto:wedding@delgaudio.dev"
          >
            wedding@delgaudio.dev
          </a>
          .
        </p>
      </div>

      <fieldset className="space-y-4 border bg-[#e6e8df] p-4 rounded shadow">
        <legend className="sr-only font-medium m-0">Your Response</legend>
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

        {attendingReception === true && (
          <div className="space-y-4 p-4">
            <div>
              <p className="font-medium text-lg">
                Dinner Selection <span className="text-red-600">*</span>
              </p>
              <p className="text-sm mb-4">
                Please select your preferred dinner option for the reception.
              </p>
            </div>

            <div className="space-y-3">
              {FOOD_OPTIONS.map(option => (
                <label
                  key={option.id}
                  className={`flex items-start space-x-3 p-3  rounded cursor-pointer hover:bg-[#d1d4c2] focus-within:ring-2 ring-stone-500 ${
                    foodOption === option.id ? 'ring-2' : ''
                  }`}
                >
                  <input
                    type="radio"
                    name="inviteeFoodOption"
                    value={option.id}
                    checked={foodOption === option.id}
                    onChange={e =>
                      setFoodOption(e.target.value as FoodOptionId)
                    }
                    className="sr-only peer"
                    required
                  />
                  <span className="w-5 h-5 flex-shrink-0 border rounded-full border-black peer-checked:-stone-600 peer-checked:bg-stone-600 transition mt-1" />
                  <div className="flex-1">
                    <div className="font-medium">{option.name}</div>
                    <div className="text-sm ">{option.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {foodOption === 'unknown' && (
              <div className="mt-4">
                <label
                  className="block mb-1 font-medium"
                  htmlFor="contactInfo-invitee"
                >
                  Phone or Email <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="contactInfo-invitee"
                  value={contactInfo}
                  onChange={e => setContactInfo(e.target.value)}
                  placeholder="Phone number or email address"
                  className="w-full p-2 border bg-white rounded focus:outline-none focus:ring"
                  required
                />
                <p className="text-sm  mt-1">
                  We'll reach out to discuss your dinner options. If we are
                  unable to connect, the Chicken Entrée will be selected by
                  default.
                </p>
              </div>
            )}
          </div>
        )}

        {data.invitee.allowedToAttendBrunch && (
          <div className="grid sm:grid-cols-2 items-center gap-2">
            <div className="flex flex-col">
              <p className="font-medium">
                Day After Brunch? <span className="text-red-600">*</span>
              </p>
              <p className="text-sm">
                Casual morning brunch the day after the wedding for close
                friends and family at the{' '}
                <OpenInExternalLink
                  title="Archer Hotel"
                  url="https://www.archerhotel.com/redmond"
                />{' '}
                in Redmond, WA on June 19, 2026 at 10:00AM PDT.
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
            Dietary Restrictions or Comments
          </label>
          <input
            type="text"
            value={dietNotes}
            id="dietaryRestrictions-invitee"
            onChange={e => setDietNotes(e.target.value)}
            placeholder="e.g. Vegetarian, Gluten-free…"
            className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
          />
        </div>
      </fieldset>

      {/* Only render guest sections if there are guests */}
      {guestResponses.length > 0 &&
        guestResponses.map((resp, idx) => (
          <fieldset
            key={idx}
            className="space-y-4 border bg-[#e6e8df] p-4 rounded shadow"
          >
            <legend className="sr-only font-medium m-0">Guest {idx + 1}</legend>
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
                    className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
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

            {/* Guest food options - only show if attending reception */}
            {resp.attendingReception === true && (
              <div className="space-y-4 p-4 bg-[#e6e8df] rounded ">
                <div>
                  <p className="font-medium text-lg">
                    Dinner Selection <span className="text-red-600">*</span>
                  </p>
                  <p className="text-sm  mb-4">
                    Please select their preferred dinner option for the
                    reception.
                  </p>
                </div>

                <div className="space-y-3">
                  {FOOD_OPTIONS.map(option => (
                    <label
                      key={option.id}
                      className="flex items-start space-x-3 p-3  rounded cursor-pointer hover:bg-gray-100 focus-within:ring-2 focus-within:ring-stone-500 selected:ring-2 checked:ring-2"
                    >
                      <input
                        type="radio"
                        name={`guestFoodOption-${idx}`}
                        value={option.id}
                        checked={resp.foodOption === option.id}
                        onChange={e =>
                          handleGuestChange(
                            idx,
                            'foodOption',
                            e.target.value as FoodOptionId,
                          )
                        }
                        className="sr-only peer"
                        required
                      />
                      <span className="w-5 h-5 flex-shrink-0 border rounded-full border-black peer-checked:-stone-600 peer-checked:bg-stone-600 transition mt-1" />
                      <div className="flex-1">
                        <div className="font-medium">{option.name}</div>
                        <div className="text-sm ">{option.description}</div>
                      </div>
                    </label>
                  ))}
                </div>

                {/* Guest contact info field - only show if "I don't know" is selected */}
                {resp.foodOption === 'unknown' && (
                  <div className="mt-4">
                    <label
                      className="block mb-1 font-medium"
                      htmlFor={`contactInfo-${idx}`}
                    >
                      Phone or Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id={`contactInfo-${idx}`}
                      value={resp.contactInfo ?? ''}
                      onChange={e =>
                        handleGuestChange(idx, 'contactInfo', e.target.value)
                      }
                      placeholder="Phone number or email address"
                      className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
                      required
                    />
                    <p className="text-sm  mt-1">
                      We'll reach out to discuss their dinner options. If we are
                      unable to connect, the Chicken Entrée will be selected by
                      default.
                    </p>
                  </div>
                )}
              </div>
            )}

            {resp.allowedToAttendBrunch && (
              <div className="grid sm:grid-cols-2 items-center gap-2">
                <div className="flex flex-col">
                  <p className="font-medium">
                    Day After Brunch? <span className="text-red-600">*</span>
                  </p>
                  <p className="text-sm">
                    Casual morning brunch the day after the wedding for close
                    friends and family at the{' '}
                    <OpenInExternalLink
                      title="Archer Hotel"
                      url="https://www.archerhotel.com/redmond"
                    />{' '}
                    in Redmond, WA on June 19, 2026 at 10:00AM PDT.
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
                Dietary Restrictions or Comments
              </label>
              <input
                id={`dietaryRestrictions-${idx}`}
                type="text"
                value={resp.dietaryRestrictions ?? ''}
                onChange={e =>
                  handleGuestChange(idx, 'dietaryRestrictions', e.target.value)
                }
                placeholder="e.g. Vegetarian, Gluten-free…"
                className="w-full p-2 border rounded bg-white focus:outline-none focus:ring"
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
