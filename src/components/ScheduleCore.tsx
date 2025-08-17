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
}

// Skeleton component to maintain layout
function EventSkeleton() {
  return (
    <Fragment>
      <div className="flex flex-col flex-nowrap items-end-safe whitespace-nowrap">
        <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
        <div className="h-4 w-12 bg-gray-200 rounded animate-pulse mt-1"></div>
      </div>
      <div>
        <div className="flex gap-2 items-center">
          <div className="h-8 w-48 bg-gray-200 rounded animate-pulse"></div>
        </div>
        <div>
          <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mt-2"></div>
          <div className="h-6 w-56 bg-gray-200 rounded animate-pulse mt-1"></div>
          <div className="h-5 w-32 bg-gray-200 rounded animate-pulse mt-1"></div>
          <div className="h-5 w-28 bg-gray-200 rounded animate-pulse mt-6"></div>
        </div>
      </div>
    </Fragment>
  );
}

export function ScheduleCore() {
  const [events, setEvents] = useState<IEvent[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-2 pb-8 px-4">
      {loading ? (
        <>
          <EventSkeleton />
          <hr className="border-b-1 border-[rgba(52,45,47,15%)] my-4" />
          <EventSkeleton />
        </>
      ) : error ? (
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
      ) : (
        events.map((event, index) => (
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
        ))
      )}
    </div>
  );
}
