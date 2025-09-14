export type RsvpPolicyType = 'both' | 'code' | 'name';

export interface IEventData {
  date: string;
  location: string;
  rsvpPolicy: RsvpPolicyType;
}
