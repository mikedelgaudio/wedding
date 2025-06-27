import type { JSX } from 'react';
import footerImg from '../assets/compress3.jpg';
import img from '../assets/ourstory.jpg';
import { FadeInOnLoad } from '../components/FadeInOnLoad';
import { PageWrapper } from '../components/PageWrapper';

export function OurStory(): JSX.Element {
  return (
    <FadeInOnLoad>
      <PageWrapper pageTitle="Our Story">
        <img
          src={img}
          alt=""
          width={1000}
          height={665}
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
        />
        <p>
          Lynh and Mike met the Summer of 2022 while interning for the same
          company in Seattle. During orientation, Mike sat next to Lynh. They
          introduced themselves to each other, but didn't think much of it. The
          next day walking back to her hotel room with groceries, Lynh saw Mike
          again. They realized they were not only placed at the same hotel, but
          also on the same floor.
        </p>
        <p>
          After work, the few intern that were placed in the same hotel would
          play games in the hotel lobby, one day they decided to play poker with
          Lynh's set of shiny gold cards. Mike did not know how to play, so Lynh
          taught him... but not for free. We didn't have Poker chips, so we
          would play for bets. First, Mike lost and had to give Lynh rides to
          work for a week (Mike was the only one who rented a car). Mike kept
          bragging about how he bought an air fryer from Costco to get him
          through the Summer living in a hotel room. The next time Mike lost, he
          offered to cook Lynh dinner with his air fryer. Lynh was skeptical...
          but also hungry, so she eventually accepted.
        </p>
        <p>
          Mike made Lynh a delicious air fryer chicken dinner, and while they
          ate they decided to play some poker just the two of them. After Mike
          lost for the third time, Mike decided to raise the stakes. "If I win
          the next hand, I get to take you out on a proper date". Mike had lost
          every poker game up to this point, so Lynh wasn't worried. But as fate
          would have it, Mike won... let's just say they spent the Summer of
          2022 playing lot of poker and eating their way around Seattle.
        </p>
        <p>Here is a throwback to our third date at Chihuly Glass Museum:</p>
        <img
          src={footerImg}
          alt=""
          width={1000}
          height={400}
          className="w-full max-w-2xl mx-auto rounded-lg shadow-lg object-cover"
        />
      </PageWrapper>
    </FadeInOnLoad>
  );
}
