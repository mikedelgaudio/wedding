import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { db } from '../firebase/firebase.service';
import { OpenInExternalLink } from './OpenInExternalLink';

interface IEvent {
  time: string;
  header: string;
  venue: string;
  address: string;
  date: string;
  mapLink: string;
  iframeSrc: string;
  description?: string;
}

const ringsSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    width="800"
    height="800"
    viewBox="0 0 1000 1000"
    className="w-12 h-12"
  >
    <path d="m216.36 158.4-27.04 31.3h55.08l23.03-27.04c12.77-14.77 24.79-28.79 26.79-31.3 3.51-4.01 2.25-4.26-23.53-4.26h-27.54l-26.79 31.3zM349.06 158.4l26.79 31.29h27.54c25.79 0 27.04-.25 23.53-4.51-2-2.25-14.02-16.27-26.79-31.29l-23.28-26.79h-54.83l27.04 31.3zM615.19 151.39c-11.77 13.52-24.03 27.54-27.04 31.29l-6.01 7.01h55.08l22.03-25.79c12.02-14.02 24.04-28.04 26.79-31.3l5.01-5.51h-54.83l-21.03 24.3zM733.61 148.89c10.52 12.27 22.53 26.29 27.29 31.54l8.26 9.51 26.79-.75 26.79-.75-26.54-30.79-26.54-30.54h-54.58l18.53 21.78zM284.96 159.15l-25.29 29.29 25.04.75c13.77.25 36.55.25 50.57 0l25.29-.75-25.04-29.29-25.29-29.29-25.28 29.29zM676.78 160.15l-24.28 28.29 25.04.75c14.02.25 36.55.25 50.57 0l25.04-.75-24.05-28.29c-13.27-15.27-25.04-28.04-26.04-28.04-1.25 0-13.01 12.77-26.28 28.04zM192.58 201.96c.25 1.5 18.28 20.78 39.56 43.31l38.81 40.81-16.27 3.25c-23.78 4.76-54.83 14.52-74.36 23.28-42.56 19.03-94.89 63.59-120.42 102.4C9.56 491.38-3.46 585.27 24.33 670.14 74.4 823.36 238.64 907.73 392.36 859.16c34.3-10.77 74.86-32.8 98.89-54.08l8.76-7.51 8.76 7.51c25.54 22.53 70.35 46.32 107.15 56.58 133.19 38.05 276.4-23.29 340.49-145.96 60.34-115.67 37.81-256.62-55.33-346.25-42.31-40.81-90.88-66.85-145.46-77.86l-15.27-3.26 34.05-36.05c19.03-20.03 37.81-40.06 42.06-44.56l7.76-8.26-27.29.75-27.04.75-19.28 42.56c-16.02 35.3-20.28 42.81-25.04 43.31-7.26 1.25-7.01.5 15.02-47.82 9.52-20.53 17.03-38.06 16.53-38.56s-25.29-.5-55.08-.25l-54.08.75 18.53 41.06c10.26 22.53 18.78 41.31 18.78 41.81s-2.5 1-5.76 1c-5.01 0-8.01-5.51-24.54-42.06l-19.03-41.81-25.29-.75c-14.02-.25-25.54.25-25.54 1.25 0 1.25 17.53 20.53 38.81 43.06 21.53 22.53 38.81 41.31 38.31 41.56s-9.76 2.5-21.03 4.76c-44.31 8.76-85.87 27.04-119.92 52.83l-21.53 16.27-15.52-12.02c-37.3-28.79-77.11-47.32-121.43-56.33l-15.27-3.26 35.55-37.55c19.53-20.78 38.31-40.81 41.81-44.56l6.01-6.76-26.79.75-27.04.75-19.28 42.56c-15.77 34.8-20.53 42.81-25.04 43.31-3 .5-5.51.25-5.51-.75 0-.75 8.51-20.03 18.78-42.81 10.26-22.78 18.78-41.81 18.78-42.56 0-.5-24.29-1-53.83-1-38.56 0-53.83.75-53.83 2.75 0 1.75 8.01 20.28 17.53 41.56 9.76 21.28 17.53 39.06 17.53 39.81 0 .5-2.5 1-5.51 1-5.01-.25-8.51-6.01-24.53-42.06l-19.03-41.81-25.79-.75c-16.25-.49-25.51.26-24.76 1.76zm160.48 128.19c40.56 8.01 84.37 28.54 111.16 51.57l8.01 7.01-13.27 17.78c-74.36 100.64-74.61 242.35-.75 344.5l14.02 19.53-16.77 12.76c-21.78 16.53-61.34 35.55-88.13 42.56-30.04 7.76-81.87 9.52-110.16 3.76-99.39-20.28-173.75-90.13-200.79-188.77-4.51-15.77-5.26-26.79-5.51-60.59-.25-37.3.5-43.56 6.51-65.09 12.27-43.81 31.29-78.11 60.59-109.66 60.34-64.34 149.22-92.89 235.09-75.36zm407.84 3c107.91 28.3 184.02 122.68 189.02 234.59 3 71.35-20.03 133.94-68.6 185.27-33.3 35.3-69.35 57.33-117.17 71.6-20.53 6.26-26.29 7.01-66.35 7.01-38.06.25-46.57-.5-65.09-5.51-26.54-7.01-71.6-29.29-90.63-44.31l-14.27-11.52L541.83 751c75.86-105.65 73.61-247.86-5.51-351.51l-8.76-11.52 16.77-12.77c30.29-22.78 71.85-40.31 113.16-48.07 6.26-1 26.79-1.5 45.31-1.25 26.3.77 39.32 2.27 58.1 7.27zM516.8 441.06c14.52 22.03 26.04 47.32 34.05 76.11 4.51 16.27 5.26 26.04 5.26 63.09 0 40.31-.75 45.57-6.76 66.35-3.75 12.27-11.77 32.55-18.03 45.06-10.26 21.03-28.04 48.57-31.55 48.82-2.25 0-23.03-31.8-31.04-47.32-16.77-33.55-23.78-61.59-25.54-102.9-1.5-38.81 2.25-65.09 14.27-98.14 11.52-31.8 36.8-73.36 43.31-71.6 1.76.5 8.77 9.77 16.03 20.53z" />
  </svg>
);

const partySvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="none"
    viewBox="0 0 24 24"
    className="w-12 h-12"
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="m5.571 14.5 3.895 3.914M19 3.61c-1.596-.015-2.334.722-2.576 1.467-.214.657-.019 2-.528 2.996-.487.951-1.776 1.489-3.239 1.534M20 7.61h.01M19 15.96h.01M7 3.95h.01M19 11.11c-1.5 0-2.5.5-3.405 1.435m-5.357-5.357c.762-1.078 1.262-2.078.77-3.66M3.536 20.464 7.07 9.858l7.071 7.071-10.606 3.536Z"
    />
  </svg>
);

const errorSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    fill="none"
    viewBox="0 0 24 24"
    className="w-6 h-6 text-red-500"
  >
    <path
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z"
    />
  </svg>
);

const locationSvg = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="800"
    height="800"
    fill="none"
    viewBox="0 0 24 24"
    className="h-6 w-6"
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 21c3.5-3.6 7-6.824 7-10.8C19 6.224 15.866 3 12 3s-7 3.224-7 7.2 3.5 7.2 7 10.8Z"
    />
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      d="M12 13a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z"
    />
  </svg>
);

// Skeleton component to maintain layout
function EventSkeleton() {
  return (
    <div className="bg-flax-smoke-50 text-flax-smoke-950 p-4 rounded-xl shadow-lg animate-pulse">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 bg-gray-300 rounded"></div>
        <div className="flex flex-col items-end">
          <div className="h-8 w-16 bg-gray-300 rounded mb-1"></div>
          <div className="h-4 w-12 bg-gray-300 rounded"></div>
        </div>
      </div>
      <div>
        <div className="h-8 w-48 bg-gray-300 rounded mb-2"></div>
        <div className="h-6 w-40 bg-gray-300 rounded mb-1"></div>
        <div className="h-6 w-56 bg-gray-300 rounded mb-1"></div>
        <div className="h-5 w-32 bg-gray-300 rounded mb-6"></div>
        <div className="h-5 w-28 bg-gray-300 rounded"></div>
      </div>
    </div>
  );
}

// Error component
function ErrorCard() {
  return (
    <div className="bg-red-50 border border-red-200 text-red-800 p-6 rounded-xl shadow-lg col-span-full">
      <div className="flex items-center gap-3 mb-2">
        {errorSvg}
        <h3 className="font-semibold text-lg">Unable to Load Schedule</h3>
      </div>
      <p className="text-red-600 mb-4">
        We're having trouble loading the event schedule. Please try refreshing
        the page.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
      >
        Refresh Page
      </button>
    </div>
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
        setError(false);
        const scheduleRef = doc(db, 'site', 'schedule');
        const snap = await getDoc(scheduleRef);

        if (snap.exists()) {
          const data = snap.data();
          setEvents(data.events || []);
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

  // Show loading skeletons
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <EventSkeleton />
        <EventSkeleton />
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="grid grid-cols-1 gap-6">
        <ErrorCard />
      </div>
    );
  }

  // Show actual events
  return (
    <div className="grid  grid-cols-1 gap-6">
      {events.map((event, index) => (
        <div key={index} className="bg-gray-50  p-4 rounded-xl shadow-lg">
          <div className="flex items-center justify-between">
            {index === 0 ? ringsSvg : partySvg}
            <div className="flex flex-col flex-nowrap items-end whitespace-nowrap">
              <span className="text-2xl">{event.time}</span>
              <span className="text-md mr-[2px] leading-3">{event.date}</span>
            </div>
          </div>
          <div>
            <div className="flex gap-2 items-center">
              <h2 className="font-bold text-2xl">{event.header}</h2>
            </div>
            <div>
              <p className="text-lg">{event.venue}</p>
              <p className="text-lg">{event.address}</p>
              {event.description && <p className="my-2">{event.description}</p>}
              <div className="flex items-center">
                <OpenInExternalLink
                  title="View on Google Maps"
                  url={event.mapLink}
                />
                {locationSvg}
              </div>
              <iframe
                src={event.iframeSrc}
                width="400"
                height="300"
                style={{ border: 0 }}
                className="w-full h-[300px] mt-4"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
