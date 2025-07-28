import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { db } from '../firebase/firebase.service';
import GoogleMapsLink from './OpenInGoogleMaps';

interface IEvent {
  time: string;
  header: string;
  venue: string;
  address: string;
  attire: string;
}

export function ScheduleCore() {
  const [events, setEvents] = useState<IEvent[]>([]);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleRef = doc(db, 'site', 'schedule');
        const snap = await getDoc(scheduleRef);

        if (snap.exists()) {
          const data = snap.data();
          setEvents(data.events || []);
        } else {
          console.warn('No schedule found.');
        }
      } catch (error) {
        console.error('Error fetching schedule:', error);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-2 pb-8 px-4">
      {events.map((event, index) => (
        <Fragment key={index}>
          <div className="flex flex-col flex-nowrap items-end-safe whitespace-nowrap">
            <span className="text-2xl">{event.time}</span>
            <span className="text-md mr-[2px] leading-3">June 18, 2026</span>
          </div>
          <div>
            <div>
              <h2 className="font-bold text-2xl">{event.header}</h2>
            </div>
            <div>
              <p className="text-lg">{event.venue}</p>
              <p className="text-lg">{event.address}</p>
              <GoogleMapsLink address={event.address} />
              <p className="mt-6">Attire: {event.attire}</p>
            </div>
          </div>
          {index < events.length - 1 && (
            <hr className="border-b-1 border-[rgba(52,45,47,15%)] my-4" />
          )}
        </Fragment>
      ))}
    </div>
  );
}
