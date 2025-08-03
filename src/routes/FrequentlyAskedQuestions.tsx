import { useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';

interface FAQItem {
  id: number;
  question: string;
  answer: JSX.Element;
}

const faqData: FAQItem[] = [
  {
    id: 1,
    question: 'How can I RSVP?',
    answer: (
      <>
        Please use the{' '}
        <Link
          className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          to="/rsvp"
        >
          RSVP form
        </Link>{' '}
        and fill it out by your RSVP's deadline.
      </>
    ),
  },
  {
    id: 2,
    question: 'When is the RSVP deadline?',
    answer: (
      <>
        The RSVP deadline is located on your invitation. Please make sure to
        submit your response by this date.
      </>
    ),
  },
  {
    id: 3,
    question: 'Is there a dress code?',
    answer: (
      <>
        While formal attire will be worn by many guests, please feel free to
        wear whatever makes you feel most comfortable—whether that's an áo dài
        (traditional Vietnamese dress), a leopard print suit, or something more
        casual. We love seeing everyone's unique style and want your personality
        to shine! The ceremony will take place outdoors, so please dress for the
        weather. We also recommend comfortable shoes, as there will be some
        walking on gravel paths and grass.
      </>
    ),
  },
  {
    id: 4,
    question: 'Where is the registry?',
    answer: (
      <>
        <p>
          We are incredibly grateful for your love and support. While we do not
          have a traditional registry, we wanted to share a meaningful custom
          from both our Vietnamese and Italian backgrounds. At the reception,
          it's customary for the couple to visit each table, and if guests wish
          to give a gift, it is often presented in a traditionally red envelope
          known as a <i lang="vi">lì xì</i> in Vietnamese culture, or known as{' '}
          <i lang="it">busta</i> in Italian.
        </p>
        <p>
          Your presence is truly the greatest gift of all, and we are so
          thankful to have you celebrate with us. If you're unable to attend but
          would still like to send a gift, we warmly encourage you to reach out
          to us or our families for a mailing address. Your thoughtfulness means
          the world to us.
        </p>
      </>
    ),
  },
  {
    id: 5,
    question: 'Where can I park?',
    answer: (
      <>
        There is parking at the venue. There will be parking attendants to
        direct you once you get to the venue.
      </>
    ),
  },
  {
    id: 6,
    question: 'Is transportation provided?',
    answer: (
      <>
        We recommend renting a car if you're flying in, as it will give you the
        flexibility to explore the beautiful Pacific Northwest. However, if you
        prefer not to drive, there are several ride-sharing options available in
        the area. On the big day, we'll be sharing an Uber voucher code. Please
        send an email to{' '}
        <a
          className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          href="mailto:voucher@delgaudio.dev?subject=Uber%20Voucher%20Request&body=Hi, I'd%20like%20to%20request%20an%20Uber%20voucher%20for%20the%20wedding."
        >
          voucher@delgaudio.dev
        </a>{' '}
        to be added to the voucher pool.
      </>
    ),
  },
  {
    id: 7,
    question: 'Will your wedding be indoors or outdoors?',
    answer: (
      <>
        The wedding will mostly be outdoors, with indoor backup at the venue in
        case of extreme weather.
      </>
    ),
  },
  {
    id: 8,
    question: 'Where is the closest airport if I’m flying in?',
    answer: (
      <>
        The closest airport is Seattle-Tacoma International Airport (SEA),
        located about 30 minutes from the venue.
      </>
    ),
  },
  {
    id: 9,
    question: 'Is there a hotel block for guests?',
    answer: (
      <>
        Since our guests will be arriving at different times—and many are either
        staying in Downtown Redmond, where there are plenty of nearby hotel
        options, or extending their trip to explore more of Seattle—we do not
        have a hotel block at this time. That said, there are lots of great
        places to stay in the area! We encourage you to use the{' '}
        <Link
          className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          to="/travel"
        >
          Travel section
        </Link>{' '}
        of our website for our recommendations and helpful links.
      </>
    ),
  },
  {
    id: 10,
    question: 'Can I bring a plus one?',
    answer: (
      <>
        Our wedding is invite only. Guests with a plus-one will be formally
        invited. If your invite does not mention a plus-one, then we are nearing
        capacity of our venue. We appreciate your understanding as we want to
        ensure we accommodate all our guests comfortably.
      </>
    ),
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
          If your question isn't here, please reach out to us by emailing{' '}
          <a
            className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
            href="mailto:wedding@delgaudio.dev"
          >
            wedding@delgaudio.dev
          </a>
          .
        </p>
        {faqData.map(item => {
          const isOpen = !!openStates[item.id]; // Check if the current item is open
          return (
            <div
              key={item.id}
              className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
            >
              <h3>
                <button
                  type="button"
                  onClick={() => toggleAccordion(item.id)}
                  className="flex justify-between cursor-pointer items-center w-full p-4 md:p-5 text-left font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  aria-expanded={isOpen}
                  aria-controls={`faq-answer-${item.id}`} // Link button to answer panel
                >
                  <span>{item.question}</span>
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
                id={`faq-answer-${item.id}`} // ID for ARIA
                role="region" // Indicate this is a panel controlled by the button
                aria-labelledby={`faq-question-${item.id}`} // Link panel back to button (optional but good practice)
                className={`overflow-hidden transition-all duration-500 ease-in-out ${
                  isOpen ? 'max-h-screen' : 'max-h-0' // Adjust max-h if needed
                }`}
                aria-hidden={!isOpen} // Hide from screen readers when collapsed
                hidden={!isOpen} // Hide from the DOM when collapsed
              >
                <div className="p-4 md:p-5 border-t border-gray-200 bg-white text-gray-600 text-xl">
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
