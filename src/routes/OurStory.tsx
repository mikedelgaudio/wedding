import type { JSX } from 'react';
import glassMuesumImg from '../assets/glassMuesum.jpg';
import img from '../assets/ourstory.jpg';
import { FadeInOnLoad } from '../components/FadeInOnLoad';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';

export function OurStory(): JSX.Element {
  return (
    <FadeInOnLoad>
      <PageWrapper pageTitle="Our Story">
        <ResponsiveFigure
          src={img}
          alt=""
          width={1000}
          height={665}
          loading="lazy"
        />
        <p className="text-lg">
          Lynh and Mike met the Summer of 2022 while interning for the same
          company in Seattle. During orientation, Mike sat next to Lynh. They
          introduced themselves to each other, but didn't think much of it. The
          next day walking back to her hotel room with groceries, Lynh saw Mike
          again. They realized they were not only working for the same company,
          but also placed at the same hotel AND on the same floor.
        </p>
        <p className="text-lg">
          After work, the few intern that were placed in the same hotel would
          play games in the hotel lobby, one day they decided to play poker with
          Lynh's set of shiny gold cards. Mike did not know how to play, so Lynh
          taught him... but not for free. We didn't have Poker chips, so we
          would play for verbal bets. First, Mike lost and had to give Lynh
          rides to work for a week (Mike was the only one who rented a car).
          This soon turned into free rides for the whole Summer. Mike kept
          bragging about how he bought an air fryer from Costco to get him
          through the Summer living in a hotel room. The next time Mike lost, he
          offered to cook Lynh dinner with his air fryer. Lynh was skeptical...
          but also hungry, so she eventually accepted.
        </p>
        <p className="text-lg">
          Mike made Lynh a delicious air fryer chicken dinner, and while they
          ate they decided to play some poker just the two of them. After Mike
          lost for the third time, Mike decided to raise the stakes. "If I win
          the next hand, I get to take you out on a proper date". Mike had lost
          every poker game up to this point, so Lynh wasn't worried. But as fate
          would have it, Mike won... let's just say they spent the Summer of
          2022 playing lot of poker and eating their way around Seattle.
        </p>
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Our third date at the Chihuly Glass Museum"
        />
        <p className="text-lg">
          After the summer ended, Mike returned to New York and Lynh returned to
          Minnesota, each visiting each other often.
        </p>
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Mike experiencing his first MN Snow"
        />
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Lynh in Timesquare"
        />
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Mike at his first MN State Fair"
        />
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Lynh & Mike at Rockefeller Center on New Years 2023"
        />

        <p className="text-lg">
          After college, Mike and Lynh both returned to Seattle for work and
          have been living there ever since. They've enjoyed exploring the
          outdoors, drinking lots of coffee, and traveling.
        </p>
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Hiking in the Pacific Northwest"
        />
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Exploring the fjords of Norway"
        />
        <ResponsiveFigure
          src={glassMuesumImg}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Magical moments at Disneyland"
        />
        <p className="text-lg">
          One of Lynh's most favorite places on Earth is the annual Tulip
          Festival in Northern Washington. For her birthday, Mike surprised Lynh
          with a photoshoot at the festival. However, Mike had more planned than
          just a photoshoot. On April 4th, 2025 Michael proposed in front of the
          first blooms of Spring:
        </p>
      </PageWrapper>
    </FadeInOnLoad>
  );
}
