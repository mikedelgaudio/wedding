import { useContext } from 'react';
import { RsvpPolicyContext } from '../context/rsvp-policy/RsvpPolicyContext';

export function useRsvpPolicy() {
  const context = useContext(RsvpPolicyContext);
  return context;
}
