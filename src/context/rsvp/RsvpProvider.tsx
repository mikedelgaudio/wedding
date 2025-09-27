import {
  doc,
  serverTimestamp,
  updateDoc,
  type DocumentSnapshot,
  type UpdateData,
} from 'firebase/firestore';
import React, { useCallback, useReducer } from 'react';
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

/**
 * Actions that can be dispatched to update the RSVP state.
 * Each action represents a specific state change in the RSVP flow.
 */
type RsvpAction =
  /** Load RSVP data from Firestore snapshot (triggers form data initialization) */
  | { type: 'SET_SNAPSHOT'; payload: DocumentSnapshot<IRSVPDoc> | null }
  /** Toggle saving state during form submission */
  | { type: 'SET_SAVING'; payload: boolean }
  /** Set error message (null clears errors) */
  | { type: 'SET_ERROR'; payload: string | null }
  /** Set success state (automatically clears errors and saving state) */
  | { type: 'SET_SUCCESS'; payload: boolean }
  /** Replace entire form data (rarely used) */
  | { type: 'UPDATE_FORM_DATA'; payload: IRsvpFormData }
  /** Update a single field on the main invitee */
  | {
      type: 'UPDATE_FIELD';
      payload: {
        field: keyof Omit<IRsvpFormData, 'guests'>;
        value: IRsvpFormData[keyof Omit<IRsvpFormData, 'guests'>];
      };
    }
  /** Update a single field on a specific guest */
  | {
      type: 'UPDATE_GUEST';
      payload: {
        guestIndex: number;
        field: keyof IGuest;
        value: IGuest[keyof IGuest];
      };
    }
  /** Reset all state back to defaults */
  | { type: 'RESET_FORM' };

/**
 * Default form data used when no RSVP data is loaded.
 * All attendance fields start as null (no selection made yet).
 */
const defaultFormData: IRsvpFormData = {
  attendingCeremony: null,
  attendingReception: null,
  attendingBrunch: null,
  dietaryRestrictions: '',
  foodOption: null,
  contactInfo: '',
  guests: [],
};

/**
 * Transforms a Firestore snapshot into form data structure.
 * Handles data normalization and provides safe defaults for missing fields.
 * This is the single source of truth for snapshot → form data conversion.
 */
function createFormDataFromSnapshot(
  snapshot: DocumentSnapshot<IRSVPDoc> | null,
): IRsvpFormData {
  if (!snapshot?.data()) {
    return defaultFormData;
  }

  const data = snapshot.data()!;

  // Normalize guest data - ensure all fields have safe defaults
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
            ? (g.foodOption as FoodOptionId)
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
}

/**
 * Reducer that manages all RSVP state transitions.
 *
 * Key design principles:
 * - SET_SNAPSHOT automatically derives form data and clears error/success states
 * - Any form updates (UPDATE_FIELD/UPDATE_GUEST) clear success flag
 * - SET_SUCCESS automatically clears errors and saving state
 * - All state changes are predictable and atomic
 */
function rsvpReducer(state: IRsvpState, action: RsvpAction): IRsvpState {
  switch (action.type) {
    case 'SET_SNAPSHOT':
      return {
        ...state,
        snapshot: action.payload,
        formData: createFormDataFromSnapshot(action.payload),
        // Clear previous error/success states when loading new snapshot
        errorMessage: null,
        successFlag: false,
      };

    case 'SET_SAVING':
      return { ...state, isSaving: action.payload };

    case 'SET_ERROR':
      return { ...state, errorMessage: action.payload, isSaving: false };

    case 'SET_SUCCESS':
      return {
        ...state,
        successFlag: action.payload,
        isSaving: false,
        errorMessage: null,
      };

    case 'UPDATE_FORM_DATA':
      return { ...state, formData: action.payload };

    case 'UPDATE_FIELD':
      return {
        ...state,
        formData: {
          ...state.formData,
          [action.payload.field]: action.payload.value,
        },
        // Clear success flag when user makes changes
        successFlag: false,
      };

    case 'UPDATE_GUEST':
      return {
        ...state,
        formData: {
          ...state.formData,
          guests: state.formData.guests.map((guest, index) =>
            index === action.payload.guestIndex
              ? { ...guest, [action.payload.field]: action.payload.value }
              : guest,
          ),
        },
        // Clear success flag when user makes changes
        successFlag: false,
      };

    case 'RESET_FORM':
      return {
        snapshot: null,
        formData: defaultFormData,
        isSaving: false,
        errorMessage: null,
        successFlag: false,
      };

    default:
      return state;
  }
}

/**
 * RsvpProvider - Main context provider for RSVP functionality.
 *
 * Manages the complete RSVP flow:
 * 1. User enters RSVP code or searches by name
 * 2. setSnapshot() loads Firestore data and initializes form
 * 3. User edits form using updateField() and updateGuest()
 * 4. User submits via submitRsvp() which validates and saves to Firestore
 * 5. Optional: resetForm() clears everything to start over
 *
 * Key benefits of this implementation:
 * - Single source of truth via useReducer
 * - No state synchronization issues
 * - Optimized re-renders with stable callbacks
 * - Automatic error/success state management
 */
export function RsvpProvider({ children }: RsvpProviderProps) {
  const [state, dispatch] = useReducer(rsvpReducer, {
    snapshot: null,
    formData: defaultFormData,
    isSaving: false,
    errorMessage: null,
    successFlag: false,
  });

  // Action creators - stable callbacks that don't cause re-renders
  const setSnapshot = useCallback((snapshot: DocumentSnapshot<IRSVPDoc>) => {
    dispatch({ type: 'SET_SNAPSHOT', payload: snapshot });
  }, []);

  /**
   * Updates a field on the main invitee (not guests).
   * Automatically clears success flag when user makes changes.
   */
  const updateField = useCallback(
    <FieldName extends keyof Omit<IRsvpFormData, 'guests'>>(
      fieldName: FieldName,
      newValue: IRsvpFormData[FieldName],
    ) => {
      dispatch({
        type: 'UPDATE_FIELD',
        payload: { field: fieldName, value: newValue },
      });
    },
    [],
  );

  /**
   * Updates a field on a specific guest.
   * Automatically clears success flag when user makes changes.
   */
  const updateGuest = useCallback(
    <FieldName extends keyof IGuest>(
      guestIndex: number,
      fieldName: FieldName,
      newValue: IGuest[FieldName],
    ) => {
      dispatch({
        type: 'UPDATE_GUEST',
        payload: { guestIndex, field: fieldName, value: newValue },
      });
    },
    [],
  );

  /**
   * Validates and submits the RSVP form to Firestore.
   *
   * Process:
   * 1. Validates required fields based on attendance selections
   * 2. Transforms form data into Firestore document format
   * 3. Saves to Firestore with optimistic error handling
   * 4. Updates state with success/error status
   * 5. Tracks analytics events for monitoring
   */
  const submitRsvp = useCallback(async () => {
    if (!state.snapshot?.data()) {
      dispatch({ type: 'SET_ERROR', payload: 'No RSVP data found' });
      return;
    }

    trackRsvpFormSubmit();
    dispatch({ type: 'SET_ERROR', payload: null });

    const data = state.snapshot.data()!;
    const validationError = validateRsvpForm({
      attendingCeremony: state.formData.attendingCeremony,
      attendingReception: state.formData.attendingReception,
      attendingBrunch: state.formData.attendingBrunch,
      foodOption: state.formData.foodOption,
      contactInfo: state.formData.contactInfo,
      guestResponses: state.formData.guests,
      inviteeAllowedToAttendBrunch: !!data.invitee.allowedToAttendBrunch,
    });

    if (validationError) {
      trackRsvpSaveError('validation_error', undefined, validationError);
      dispatch({ type: 'SET_ERROR', payload: validationError });
      return;
    }

    dispatch({ type: 'SET_SAVING', payload: true });
    try {
      // Build Firestore payload - transform form data to document structure
      const payload: UpdateData<IRSVPDoc> = {
        invitee: {
          name: data.invitee.name, // Preserve original name (read-only)
          attendingCeremony: state.formData.attendingCeremony,
          attendingReception: state.formData.attendingReception,
          attendingBrunch: state.formData.attendingBrunch,
          dietaryRestrictions: state.formData.dietaryRestrictions || null,
          // Only save food option if attending reception
          foodOption: state.formData.attendingReception
            ? state.formData.foodOption
            : null,
          // Only require contact info if attending any event
          contactInfo:
            state.formData.attendingCeremony ||
            state.formData.attendingReception ||
            state.formData.attendingBrunch
              ? state.formData.contactInfo || null
              : null,
        },
        lastModified: serverTimestamp(),
      };

      // Handle guest responses (if any)
      if (state.formData.guests.length > 0) {
        payload.guests = state.formData.guests.map<
          Omit<IGuest, 'allowedToAttendBrunch'>
        >(g => ({
          name: g.name,
          attendingCeremony: g.attendingCeremony,
          attendingReception: g.attendingReception,
          attendingBrunch: g.attendingBrunch,
          dietaryRestrictions: g.dietaryRestrictions || null,
          isNameEditable: g.isNameEditable,
          // Only save food option if attending reception
          foodOption: g.attendingReception ? g.foodOption : null,
          // Only require contact info if attending any event
          contactInfo:
            g.attendingCeremony || g.attendingReception || g.attendingBrunch
              ? g.contactInfo || null
              : null,
        }));
      } else {
        payload.guests = [];
      }

      // Save to Firestore
      const ref = doc(db, 'rsvp', state.snapshot.id);
      await updateDoc(ref, payload);

      dispatch({ type: 'SET_SUCCESS', payload: true });
      trackRsvpSaveSuccess();
    } catch (err) {
      const firebaseError = err as { code?: string; message?: string };
      trackRsvpSaveError(
        'firebase_error',
        firebaseError.code,
        firebaseError.message,
      );
      dispatch({
        type: 'SET_ERROR',
        payload:
          'An error occurred while saving your RSVP. Please refresh the page and try again or contact us.',
      });
    }
  }, [state.snapshot, state.formData]);

  /**
   * Resets all state back to initial values.
   * Useful for starting a completely new RSVP session.
   */
  const resetForm = useCallback(() => {
    dispatch({ type: 'RESET_FORM' });
  }, []);

  // Expose state in the expected interface format
  const contextState: IRsvpState = {
    snapshot: state.snapshot,
    formData: state.formData,
    isSaving: state.isSaving,
    errorMessage: state.errorMessage,
    successFlag: state.successFlag,
  };

  // Expose actions with stable references (don't change on re-renders)
  const actions = {
    setSnapshot,
    updateField,
    updateGuest,
    submitRsvp,
    resetForm,
  };

  const contextValue: IRsvpContext = {
    state: contextState,
    actions,
  };

  return (
    <RsvpContext.Provider value={contextValue}>{children}</RsvpContext.Provider>
  );
}
