import { useState, type JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
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
      'To RSVP, please visit our website and fill out the RSVP form by March 1st, 2026.',
  },
  {
    id: 2,
    question: 'When is the RSVP deadline?',
    answer:
      'The RSVP deadline is March 1st, 2026. Please make sure to submit your response by this date.',
  },
  {
    id: 9,
    question: 'Is there a dress code?',
    answer:
      'Nope, please wear whatever you feel comfortable in whether that be an ao dai (traditional Vietnamese dress), a leopard print suit, or something more casual! Let your personality shine!! The wedding will be outdoors, so please dress accordingly for the weather. We do recommend wearing comfortable shoes as there will be some walking on gravel paths and grass.',
  },
  {
    id: 11,
    question: 'Where is the registry?',
    answer:
      'We are so grateful for your love and support, but we do not have a registry. Traditionally in both Vietnamese and Italian culture, the couple will go and greet their guests during the reception and that is when (if the guest wishes) they will give the couple a envelope (typically a red one in Vietnamese culture or called "busta" in Italian culture) which is placed in a satin bag (called la borsa in Italian culture).',
  },
  {
    id: 3,
    question: 'Where can I park?',
    answer:
      'There is parking at the venue. There will be two parking attendants to direct you once you get to the venue.',
  },
  {
    id: 4,
    question: 'Is transportation provided?',
    answer:
      'Transportation will not be provided. Please plan to drive or arrange your own transportation to the venue.',
  },
  {
    id: 6,
    question: 'Will your wedding be indoors or outdoors?',
    answer:
      'The wedding will mostly be outdoors, with indoor/tented backup at the venue in case of extreme weather.',
  },
  {
    id: 7,
    question: 'Where is the closest airport if I’m flying in?',
    answer:
      'The closest airport is Seattle-Tacoma International Airport (SEA), located about 30 minutes from the venue.',
  },
  {
    id: 8,
    question: 'Is there a hotel block for guests?',
    answer:
      'Because we have many guest coming at different times and would like to stay in different places for their travel plans, we are not reserving a hotel block. However, there are many hotels in the area please check the travel section of the website for recommendations.',
  },
  {
    id: 10,
    question: 'Can I bring a plus one?',
    answer:
      'Our wedding is invite only. Guests with a plus-one will be formally invited. If your invite does not mention a plus-one, we kindly ask that you attend solo. We appreciate your understanding as we have limited space at the venue.',
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
    <AppWithHeader>
      <PageWrapper pageTitle="Frequently Asked Questions">
        <p>
          Have a question that you don't see answered here? Please reach out to
          us by emailing{' '}
          <a href="mailto:wedding@delgaudio.dev">wedding@delgaudio.dev</a>
        </p>
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
    </AppWithHeader>
  );
}
