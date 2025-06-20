import type { JSX } from 'react';
import { useEffect, useRef } from 'react';

export type TimelineItem = {
  date: string;
  title: string;
  description: string;
  time?: string;
};

type TimelineBuilderProps = {
  events: TimelineItem[];
};

export function TimelineBuilder({ events }: TimelineBuilderProps): JSX.Element {
  const containerRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = containerRefs.current.map(ref => {
      if (!ref) return;

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
          }
        },
        { threshold: 0.3 },
      );

      observer.observe(ref);
      return observer;
    });

    return () => observers.forEach(observer => observer?.disconnect());
  }, []);

  return (
    <div className="space-y-12">
      {events.map((event, index) => (
        <div
          key={index}
          ref={el => (containerRefs.current[index] = el)}
          className="
            opacity-0 translate-y-8 transition-all duration-700 ease-out
            max-w-prose mx-auto text-center border border-gray-200 p-6 rounded-md shadow-sm
          "
        >
          <p className="text-sm tracking-widest uppercase text-gray-500 mb-2">
            {event.date}
          </p>
          <h3 className="text-2xl font-semibold tracking-wide uppercase text-gray-800 mb-2">
            {event.title}
          </h3>
          {event.time && (
            <p className="italic text-gray-600 mb-4">{event.time}</p>
          )}
          <p className="text-gray-700 leading-relaxed">{event.description}</p>
        </div>
      ))}
    </div>
  );
}
