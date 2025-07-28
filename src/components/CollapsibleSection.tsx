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
      className={` ${!useSubHeading ? 'border-b border-gray-300' : ''} pb-4`}
    >
      <button
        id={`toggle-${id}`}
        onClick={() => setIsOpen(prev => !prev)}
        className={`cursor-pointer text-2xl font-bold mt-2 w-full flex justify-between items-center focus:outline-none focus-visible:ring focus-visible:ring-black-500 rounded`}
        aria-expanded={isOpen}
        aria-controls={`content-${id}`}
      >
        <span
          className={
            useSubHeading ? 'text-lg font-medium ml-2' : 'text-xl font-semibold'
          }
        >
          {title}
        </span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>

      <div
        id={`content-${id}`}
        role="region"
        aria-labelledby={`toggle-${id}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className={`${useSubHeading ? 'ml-2' : ''} mt-2`}>{children}</div>
      </div>
    </div>
  );
}
