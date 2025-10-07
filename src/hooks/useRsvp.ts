import { useContext } from 'react';
import { RsvpContext } from '../context/rsvp/RsvpContext';

export function useRsvp() {
  const context = useContext(RsvpContext);
  if (!context) {
    throw new Error('useRsvp must be used within a RsvpProvider');
  }
  return context;
}