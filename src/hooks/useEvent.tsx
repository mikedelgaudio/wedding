import { useContext } from 'react';
import { EventContext } from '../context/event/EventContext';
import type { IEventData } from '../context/event/IEventData';

export function useEvent(): IEventData | null {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEvent must be used within an EventProvider');
  }
  return context;
}
