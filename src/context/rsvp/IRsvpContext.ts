import type { DocumentSnapshot } from 'firebase/firestore';
import type { IGuest, IRSVPDoc } from '../../firebase/IRSVPDoc';
import type { FoodOptionId } from '../../components/rsvp/utils/foodOptions';

export interface IRsvpFormData {
  attendingCeremony: boolean | null;
  attendingReception: boolean | null;
  attendingBrunch: boolean | null;
  dietaryRestrictions: string;
  foodOption: FoodOptionId | null;
  contactInfo: string;
  guests: IGuest[];
}

export interface IRsvpState {
  snapshot: DocumentSnapshot<IRSVPDoc> | null;
  formData: IRsvpFormData;
  isSaving: boolean;
  errorMessage: string | null;
  successFlag: boolean;
}

export interface IRsvpActions {
  setSnapshot: (snapshot: DocumentSnapshot<IRSVPDoc>) => void;
  updateField: <K extends keyof Omit<IRsvpFormData, 'guests'>>(
    field: K,
    value: IRsvpFormData[K]
  ) => void;
  updateGuest: <K extends keyof IGuest>(
    guestIndex: number,
    field: K,
    value: IGuest[K]
  ) => void;
  submitRsvp: () => Promise<void>;
  resetForm: () => void;
}

export interface IRsvpContext {
  state: IRsvpState;
  actions: IRsvpActions;
}