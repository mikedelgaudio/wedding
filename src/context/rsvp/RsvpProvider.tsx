import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import React, { useCallback, useMemo, useState } from 'react';
import {
  isValidFoodOption,
  type FoodOptionId,
} from '../../components/rsvp/utils/foodOptions';
import { validateRsvpForm } from '../../components/rsvp/utils/validateRsvpForm';
import { db } from '../../firebase/firebase.service';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import {
  trackRsvpFormSubmit,
  trackRsvpSaveError,
  trackRsvpSaveSuccess,
} from '../../utils/analytics';
import type { IRsvpContext, IRsvpFormData, IRsvpState } from './IRsvpContext';
import { RsvpContext } from './RsvpContext';

interface RsvpProviderProps {
  children: React.ReactNode;
}

export function RsvpProvider({ children }: RsvpProviderProps) {
  const [snapshot, setSnapshot] = useState<DocumentSnapshot<IRSVPDoc> | null>(
    null,
  );
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successFlag, setSuccessFlag] = useState(false);

  // Initialize form data from snapshot when it changes
  const formData = useMemo((): IRsvpFormData => {
    if (!snapshot?.data()) {
      return {
        attendingCeremony: null,
        attendingReception: null,
        attendingBrunch: null,
        dietaryRestrictions: '',
        foodOption: null,
        contactInfo: '',
        guests: [],
      };
    }

    const data = snapshot.data()!;
    const normalizedGuests: IGuest[] =
      !data.guests || !Array.isArray(data.guests) || data.guests.length === 0
        ? []
        : data.guests.map(g => ({
            name: g.name ?? '',
            attendingCeremony: g.attendingCeremony ?? null,
            attendingReception: g.attendingReception ?? null,
            attendingBrunch: g.attendingBrunch ?? null,
            allowedToAttendBrunch: g.allowedToAttendBrunch ?? false,
            dietaryRestrictions: g.dietaryRestrictions ?? '',
            isNameEditable: g.isNameEditable ?? false,
            foodOption: isValidFoodOption(g.foodOption ?? null)
              ? g.foodOption
              : null,
            contactInfo: g.contactInfo ?? '',
          }));

    return {
      attendingCeremony: data.invitee.attendingCeremony ?? null,
      attendingReception: data.invitee.attendingReception ?? null,
      attendingBrunch: data.invitee.attendingBrunch ?? null,
      dietaryRestrictions: data.invitee.dietaryRestrictions ?? '',
      foodOption: isValidFoodOption(data.invitee.foodOption ?? null)
        ? (data.invitee.foodOption as FoodOptionId)
        : null,
      contactInfo: data.invitee.contactInfo ?? '',
      guests: normalizedGuests,
    };
  }, [snapshot]);

  const [localFormData, setLocalFormData] = useState<IRsvpFormData>(formData);

  // Update local form data when snapshot changes
  React.useEffect(() => {
    setLocalFormData(formData);
  }, [formData]);

  /**
   * Updates a specific field in the main invitee's RSVP form data.
   * Uses TypeScript generics to ensure type safety between field name and value.
   *
   * @param fieldName - The field name to update (e.g., 'attendingCeremony', 'foodOption')
   * @param newValue - The new value for the field (type-checked against the field)
   */
  const updateField = useCallback(
    <FieldName extends keyof Omit<IRsvpFormData, 'guests'>>(
      fieldName: FieldName,
      newValue: IRsvpFormData[FieldName],
    ) => {
      setLocalFormData(previousFormData => ({
        ...previousFormData,
        [fieldName]: newValue
      }));
    },
    [],
  );

  /**
   * Updates a specific field for a guest at the given index.
   * Uses TypeScript generics to ensure type safety between field name and value.
   *
   * @param guestIndex - Index of the guest in the guests array (0-based)
   * @param fieldName - The field name to update (e.g., 'attendingCeremony', 'foodOption')
   * @param newValue - The new value for the field (type-checked against the field)
   */
  const updateGuest = useCallback(
    <FieldName extends keyof IGuest>(
      guestIndex: number,
      fieldName: FieldName,
      newValue: IGuest[FieldName],
    ) => {
      setLocalFormData(previousFormData => ({
        ...previousFormData,
        guests: previousFormData.guests.map((guest, currentIndex) =>
          currentIndex === guestIndex
            ? { ...guest, [fieldName]: newValue } // Update only the target guest
            : guest, // Keep other guests unchanged
        ),
      }));
    },
    [],
  );

  const submitRsvp = useCallback(async () => {
    if (!snapshot?.data()) {
      setErrorMessage('No RSVP data found');
      return;
    }

    trackRsvpFormSubmit();
    setErrorMessage(null);

    const data = snapshot.data()!;
    const validationError = validateRsvpForm({
      attendingCeremony: localFormData.attendingCeremony,
      attendingReception: localFormData.attendingReception,
      attendingBrunch: localFormData.attendingBrunch,
      foodOption: localFormData.foodOption,
      contactInfo: localFormData.contactInfo,
      guestResponses: localFormData.guests,
      inviteeAllowedToAttendBrunch: !!data.invitee.allowedToAttendBrunch,
    });

    if (validationError) {
      trackRsvpSaveError('validation_error', undefined, validationError);
      setErrorMessage(validationError);
      return;
    }

    setIsSaving(true);
    try {
      const payload: UpdateData<IRSVPDoc> = {
        invitee: {
          name: data.invitee.name,
          attendingCeremony: localFormData.attendingCeremony,
          attendingReception: localFormData.attendingReception,
          attendingBrunch: localFormData.attendingBrunch,
          dietaryRestrictions: localFormData.dietaryRestrictions || null,
          foodOption: localFormData.attendingReception
            ? localFormData.foodOption
            : null,
          contactInfo:
            localFormData.attendingCeremony ||
            localFormData.attendingReception ||
            localFormData.attendingBrunch
              ? localFormData.contactInfo || null
              : null,
        },
        lastModified: serverTimestamp(),
      };

      if (localFormData.guests.length > 0) {
        payload.guests = localFormData.guests.map<
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

      const ref = doc(db, 'rsvp', snapshot.id);
      await updateDoc(ref, payload);

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
  }, [snapshot, localFormData]);

  const resetForm = useCallback(() => {
    setSnapshot(null);
    setLocalFormData({
      attendingCeremony: null,
      attendingReception: null,
      attendingBrunch: null,
      dietaryRestrictions: '',
      foodOption: null,
      contactInfo: '',
      guests: [],
    });
    setIsSaving(false);
    setErrorMessage(null);
    setSuccessFlag(false);
  }, []);

  const state: IRsvpState = {
    snapshot,
    formData: localFormData,
    isSaving,
    errorMessage,
    successFlag,
  };

  const actions = {
    setSnapshot,
    updateField,
    updateGuest,
    submitRsvp,
    resetForm,
  };

  const contextValue: IRsvpContext = {
    state,
    actions,
  };

  return (
    <RsvpContext.Provider value={contextValue}>{children}</RsvpContext.Provider>
  );
}
