import type { Timestamp } from 'firebase/firestore';

interface IAttending {
  attendingCeremony: boolean | null;
  attendingReception: boolean | null;
  attendingBrunch: boolean | null;
  allowedToAttendBrunch: boolean;
}

export interface IInvitee extends IAttending {
  name: string;
  dietaryRestrictions: string | null;
  foodOption?: string | null;
  contactInfo?: string | null;
}

export interface IGuest extends IInvitee {
  isNameEditable: boolean;
}

export interface IRSVPDoc {
  inviteCode: string;
  rsvpDeadline: Timestamp;
  invitee: IInvitee;
  guests?: IGuest[] | null;
  lastModified: Timestamp;
}
