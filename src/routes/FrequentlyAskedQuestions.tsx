import { useCallback, useState, type JSX } from 'react';
import { Link } from 'react-router-dom';
import { AppWithHeader } from '../AppWithHeader';
import { AccordionItem } from '../components/AccordianItem';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

interface FAQItem {
  question: string;
  answer: JSX.Element;
}

const faqData: FAQItem[] = [
  {
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
        and fill it out by your RSVP's deadline listed on your invitation.
      </>
    ),
  },
  {
    question: 'When is the RSVP deadline?',
    answer: (
      <>
        The RSVP deadline is located on your invitation. Please make sure to
        submit your response by this date.
      </>
    ),
  },
  {
    question: 'Can I bring a plus one?',
    answer: (
      <>
        All plus-one guests are indicated on your{' '}
        <Link
          className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          to="/rsvp"
        >
          RSVP form
        </Link>{' '}
        or shared directly with other guests. If you have any questions, please
        email us at{' '}
        <a
          className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          href="mailto:wedding@delgaudio.dev"
        >
          wedding@delgaudio.dev
        </a>
        .
      </>
    ),
  },
  {
    question: 'Is there a dress code?',
    answer: (
      <>
        While many guests will be in formal attire, please feel free to wear
        whatever makes you most comfortable. Whether that's an áo dài
        (traditional Vietnamese dress), a pastel suit, or something more
        relaxed. Picture a summer garden celebration: bright colors, playful
        prints, and outfits that show off your unique style are highly
        encouraged! The ceremony will be outdoors, so please dress for the
        weather and keep in mind there will be some walking on gravel paths and
        grass (comfortable shoes recommended). We are so excited to see your
        personality shine through in what you wear!
      </>
    ),
  },
  {
    question: 'Where is the registry?',
    answer: (
      <>
        We are incredibly grateful for your love and support. While we do not
        have a traditional registry, we wanted to share a meaningful custom from
        both our Vietnamese and Italian backgrounds. At the reception, it's
        customary for the couple to visit each table, and if guests wish to give
        a gift, it is often presented in a traditionally red envelope known as a{' '}
        <i lang="vi">lì xì</i> in Vietnamese culture, or known as{' '}
        <i lang="it">busta</i> in Italian.
      </>
    ),
  },
  {
    question: 'What is your mailing address?',
    answer: (
      <>
        Please email us at{' '}
        <a
          className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
          href="mailto:wedding@delgaudio.dev"
        >
          wedding@delgaudio.dev
        </a>{' '}
        for our mailing address or reach out to our families. Thank you!
      </>
    ),
  },
  {
    question: 'Where can I park?',
    answer: (
      <>
        <p className="mb-2">
          For the Church, there is plenty of parking available in the church
          lot.
        </p>
        <p>
          At Château Lill, parking attendants will be on-site to guide you once
          you arrive. Please note that the driveway up to the Château is narrow
          and only allows for one car at a time, so use caution when arriving in
          case another vehicle is coming down.
        </p>
        <ResponsiveFigure
          src={`${CDN_URL}/driveway.jpg`}
          alt=""
          loading="lazy"
          width={500}
          height={500}
          caption="Driveway into Château Lill"
        ></ResponsiveFigure>
      </>
    ),
  },

  {
    question: 'Will your wedding be indoors or outdoors?',
    answer: (
      <>
        The wedding will mostly be outdoors, with indoor backup at the venue in
        case of extreme weather.
      </>
    ),
  },
  {
    question: 'What will the weather be like?',
    answer: (
      <>
        Welcome to the Pacific Northwest! In the early summer, you can expect
        mild temperatures, typically ranging from the mid-70s to 60s °F.
        However, it's always a good idea to check the forecast closer to the
        date, as weather can be unpredictable. We recommend dressing in layers
        and being prepared for both sun and clouds.
      </>
    ),
  },
  {
    question: "Where is the closest airport if I'm flying in?",
    answer: (
      <>
        The closest airport is Seattle-Tacoma International Airport (SEA),
        located about 30 minutes from the venue.
      </>
    ),
  },
  {
    question: 'Is there a hotel block for guests?',
    answer: (
      <>
        We've secured a hotel block at the Archer Hotel in Downtown Redmond! We
        highly recommend booking early, as space is limited. If the hotel block
        is full, don't worry - there are plenty of excellent accommodations
        throughout the area. For our complete recommendations and helpful
        booking links, please visit the{' '}
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
        to ensure you get notified!
      </>
    ),
  },
];

export function FrequentlyAskedQuestions(): JSX.Element {
  // State to keep track of which accordion items are open
  // We use a Record where the key is the FAQ item's id and value is boolean (true=open)
  const [openStates, setOpenStates] = useState<Record<number, boolean>>({});

  // Function to toggle the open state for a specific item
  const toggleAccordion = useCallback((id: number) => {
    setOpenStates(prevStates => ({
      ...prevStates, // Keep the state of other items
      [id]: !prevStates[id], // Toggle the state for the clicked item
    }));
  }, []);

  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Frequently Asked Questions">
        <p className="text-xl">
          If your question isn't here, please email us at{' '}
          <a
            className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
            href="mailto:wedding@delgaudio.dev"
          >
            wedding@delgaudio.dev
          </a>
          .
        </p>
        {faqData.map((item, index) => (
          <AccordionItem
            key={index}
            id={index}
            title={item.question}
            isOpen={!!openStates[index]}
            onToggle={() => toggleAccordion(index)}
          >
            {item.answer}
          </AccordionItem>
        ))}
      </PageWrapper>
    </AppWithHeader>
  );
}
