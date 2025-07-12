import { useState, type JSX } from 'react';
import { FadeInOnLoad } from '../components/FadeInOnLoad';
import { PageWrapper } from '../components/PageWrapper';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'How can I RSVP?',
    answer:
      'To RSVP, please visit our website and fill out the RSVP form by June 1st, 2026.',
  },
  {
    id: 2,
    question: 'When is the RSVP deadline?',
    answer:
      'The RSVP deadline is June 1st, 2026. Please make sure to submit your response by this date.',
  },
  {
    id: 3,
    question: 'Where can I park for the ceremony?',
    answer:
      'There are several parking options available near the ceremony venue. We recommend arriving early to secure a spot.',
  },
  {
    id: 4,
    question: 'Is transportation provided?',
    answer:
      'Transportation will be provided from the designated parking areas to the ceremony venue. Please check your invitation for details.',
  },
  {
    id: 5,
    question: 'Is there parking at the reception venue?',
    answer:
      'Yes, there will be parking available at the reception venue. Please follow the signs and instructions from the parking attendants.',
  },
  {
    id: 6,
    question: 'Will your wedding be indoors or outdoors?',
    answer:
      'The ceremony will be held outdoors, weather permitting. In case of inclement weather, we have a backup indoor location.',
  },
  {
    id: 7,
    question: 'Where is the closest airport if I’m flying in?',
    answer:
      'The closest airport is XYZ International Airport, located about 20 miles from the venue.',
  },
];

export function FrequentlyAskedQuestions(): JSX.Element {
  // State to keep track of which accordion items are open
  // We use a Record where the key is the FAQ item's id and value is boolean (true=open)
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  // Function to toggle the open state for a specific item
  const toggleAccordion = (id: number) => {
    setOpenStates(prevStates => ({
      ...prevStates, // Keep the state of other items
      [id]: !prevStates[id], // Toggle the state for the clicked item
    }));
  };

  return (
    <FadeInOnLoad>
      <PageWrapper pageTitle="Frequently Asked Questions">
        {faqData.map(item => {
          const isOpen = !!openStates[item.id]; // Check if the current item is open

          return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              {/* Question Button */}
              <h3>
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="flex justify-between cursor-pointer items-center w-full p-4 md:p-5 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`} // Link button to answer panel
                >
                  <span>{item.question}</span>
                  {/* Icon indicating open/closed state */}
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

              {/* Answer Panel - uses max-height transition */}
              <div
                id={`faq-answer-${item.id}`} // ID for ARIA
                role="region" // Indicate this is a panel controlled by the button
                aria-labelledby={`faq-question-${item.id}`} // Link panel back to button (optional but good practice)
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-screen' : 'max-h-0' // Adjust max-h if needed
                }`}
                aria-hidden={!isOpen} // Hide from screen readers when collapsed
              >
                <div className="p-4 md:p-5 border-t border-gray-200 bg-white text-gray-600">
                  {item.answer}
                </div>
              </div>
            </div>
          );
        })}
      </PageWrapper>
    </FadeInOnLoad>
  );
}
