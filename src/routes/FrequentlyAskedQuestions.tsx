import { h } from 'preact';
import { useState } from 'preact/hooks';

interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

// Sample data store (you can replace this with data fetched from an API)
const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'What is Preact?',
    answer:
      'Preact is a fast, 3kB alternative to React with the same modern component API. It provides the thinnest possible Virtual DOM abstraction on top of the DOM.',
  },
  {
    id: 2,
    question: 'How does Tailwind CSS work?',
    answer:
      'Tailwind CSS is a utility-first CSS framework packed with classes like flex, pt-4, text-center and rotate-90 that can be composed to build any design, directly in your markup.',
  },
  {
    id: 3,
    question: 'Why use TypeScript with Preact?',
    answer:
      'TypeScript adds static typing to JavaScript, catching errors during development and improving code quality, maintainability, and developer tooling support (like autocompletion).',
  },
  {
    id: 4,
    question: 'What are the benefits of Vite?',
    answer:
      'Vite is a modern frontend build tool that significantly improves the frontend development experience. It offers lightning-fast cold server start and instant Hot Module Replacement (HMR).',
  },
];

export function FrequentlyAskedQuestions(): h.JSX.Element {
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
    <div className="w-full max-w-[1000px] mx-auto p-4 md:p-6">
      <h2 className="text-2xl md:text-3xl font-bold  mb-6 text-gray-800">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
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
                  className="flex justify-between cursor-pointer items-center w-full p-4 md:p-5 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus-visible:ring focus-visible:ring-blue-500 focus-visible:ring-opacity-75"
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
                    stroke-width="2"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
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
      </div>
    </div>
  );
}
