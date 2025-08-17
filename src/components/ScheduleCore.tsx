import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import { db } from '../firebase/firebase.service';
import { OpenInExternalLink } from './OpenInExternalLink';

interface IEvent {
  time: string;
  header: string;
  venue: string;
  address: string;
  attire: string;
  date: string;
  imageSrc: string;
}

export function ScheduleCore() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const scheduleRef = doc(db, 'site', 'schedule');
        const snap = await getDoc(scheduleRef);

        if (snap.exists()) {
          const data = snap.data();
          setEvents(data.events || []);
          setError(false);
        } else {
          setError(true);
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error fetching schedule:', error);
        setError(true);
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
            <span className="text-md mr-[2px] leading-3">{event.date}</span>
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <h2 className="font-bold text-2xl">{event.header}</h2>
            </div>
            <div>
              <p className="text-lg">{event.venue}</p>
              <p className="text-lg">{event.address}</p>
              <OpenInExternalLink
                title="View on Google Maps"
                googleMaps={{ address: event.address }}
              />
              <p className="mt-6">Attire: {event.attire}</p>
            </div>
          </div>
          {index < events.length - 1 && (
            <hr className="border-b-1 border-[rgba(52,45,47,15%)] my-4" />
          )}
        </Fragment>
      ))}
      {error && (
        <div className="bg-red-700 font-bold text-white mb-4 p-4 rounded">
          <span role="alert">
            The schedule service is unavailable. Please try again later or
            contact us at{' '}
            <a
              className="underline hover:no-underline"
              href="mailto:wedding@delgaudio.dev"
            >
              wedding@delgaudio.dev
            </a>
            .
          </span>
        </div>
      )}
    </div>
  );
}
