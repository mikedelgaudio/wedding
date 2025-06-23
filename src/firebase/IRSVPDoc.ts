import type { Timestamp } from 'firebase/firestore';

export interface IInvitee {
  name: string;
  attending: boolean | null;
  dietaryRestrictions: string | null;
}

export interface IGuest {
  name: string | null;
  attending: boolean | null;
  dietaryRestrictions: string | null;
}

export interface IRSVPDoc {
  inviteCode: string;
  rsvpDeadline: Timestamp;
  invitee: IInvitee;
  guests: IGuest[];
}
