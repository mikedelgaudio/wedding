import { useState, type JSX } from 'react';

interface CollapsibleSectionProps {
  id: string;
  title: string;
  children: JSX.Element | JSX.Element[];
  useSubHeading?: boolean;
}

export function CollapsibleSection({
  id,
  title,
  children,
  useSubHeading,
}: CollapsibleSectionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className={`border border-gray-200 rounded-lg overflow-hidden shadow-sm ${
        useSubHeading ? 'mb-4' : ''
      }`}
    >
      <h3>
        <button
          id={`toggle-${id}`}
          onClick={() => setIsOpen(prev => !prev)}
          className="flex justify-between cursor-pointer items-center w-full p-4 md:p-5 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          aria-expanded={isOpen}
          aria-controls={`content-${id}`}
        >
          <span className={useSubHeading ? 'text-xl font-medium' : ''}>
            {title}
          </span>
          {/* Arrow icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`w-5 h-5 transform transition-transform duration-300 ease-in-out ${
              isOpen ? 'rotate-180' : 'rotate-0'
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>
      </h3>
      <div
        id={`content-${id}`}
        role="region"
        aria-labelledby={`toggle-${id}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out`}
        aria-hidden={!isOpen}
        hidden={!isOpen}
      >
        <div className="p-4 md:p-5 border-t border-gray-200 bg-white text-gray-600">
          {children}
        </div>
      </div>
    </div>
  );
}
