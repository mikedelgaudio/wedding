import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase.service';
import { EventContext } from './EventContext';
import type { IEventData } from './IEventData';

export function EventProvider({ children }: { children: React.ReactNode }) {
  const [eventData, setEventData] = useState<IEventData | null>(null);

  useEffect(() => {
    async function fetchEventDataOnce() {
      try {
        const eventDocRef = doc(db, 'site', 'event');
        const eventDoc = await getDoc(eventDocRef);
        if (eventDoc.exists()) {
          const data = eventDoc.data();
          setEventData({
            date: data.date,
            location: data.location,
            allowRsvpByName: data.allowRsvpByName,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch event data:', error);
      }
    }

    fetchEventDataOnce();
  }, []);

  return (
    <EventContext.Provider value={eventData}>{children}</EventContext.Provider>
  );
}
