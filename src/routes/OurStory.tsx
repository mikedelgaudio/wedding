import type { JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function OurStory(): JSX.Element {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Our Story">
        <ResponsiveFigure
          src={`${CDN_URL}/public-hero.jpg`}
          alt=""
          width={583}
          height={300}
          loading="eager"
        />
        <p className="text-lg">
          Lynh and Mike met the Summer of 2021 while interning for the same
          company in Redmond, WA. During orientation, they were assigned to
          tables based on the org that they would be working for. Mike sat next
          to Lynh. They introduced themselves to each other, but didn't think
          much of it. From what they can recall, Lynh said "The only thing I
          know about Staten Island is Pete Davidson is from there" and Mike
          asked about if the weather really was that cold in Minnesota.
        </p>
        <p className="text-lg">
          The next day walking back to her hotel room with groceries, Lynh saw
          Mike again. As fate would have it, they were not only working for the
          same company in the same org, but also placed at the same hotel AND on
          the same floor.
        </p>
        <p className="text-lg">
          After work, the interns that were placed in the Residence Inn Redmond
          would play games in the hotel lobby. One day they decided to play
          poker, one of Lynh's favorite games. Mike did not know how to play, so
          Lynh taught him... but not for free. We didn't have Poker chips, so we
          would play for verbal bets. First, Mike lost and had to give Lynh
          rides to work for a week (Mike was the only one who rented a car for
          the Summer). This soon turned into free rides for the whole Summer.
          Mike kept bragging about how he bought an air fryer from Costco to get
          him through the Summer living in a hotel room. The next time Mike
          lost, he offered to cook Lynh dinner with his air fryer. Lynh was
          skeptical... but also hungry, so she eventually accepted.
        </p>
        <p className="text-lg">
          Mike made Lynh a delicious air fryer chicken dinner, and while they
          ate they decided to play some poker just the two of them. After Mike
          lost for the third time, Mike decided to raise the stakes. "If I win
          the next hand, I get to take you out on a <strong>proper</strong>{' '}
          date". Mike had lost every poker game up to this point, so Lynh wasn't
          worried. But as fate would have it, Mike won... let's just say they
          spent the Summer of 2022 playing lot of poker and eating their way
          around Seattle.
        </p>
        <ResponsiveFigure
          src={`${CDN_URL}/museum.jpg`}
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
          src={`${CDN_URL}/mikeSnow.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Mike experiencing his first MN Snow"
        />
        <ResponsiveFigure
          src={`${CDN_URL}/timesSquare.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Lynh in Timesquare"
        />

        <p className="text-lg">
          After college, Mike and Lynh both returned to Redmond for work and
          have been living there ever since!
        </p>
        <h3 className="text-lg font-bold mt-4">The Proposal</h3>
        <p className="text-lg">
          One of Lynh's most favorite places on Earth is the annual Tulip
          Festival in Northern Washington. For her birthday, Mike surprised Lynh
          with a photoshoot at the festival. However, Mike had more planned than
          just a photoshoot.
        </p>
        <p className="text-lg">
          On April 4th, 2025 Mike proposed in front of the first blooms of
          Spring.
        </p>
        <ResponsiveFigure
          src={`${CDN_URL}/proposal.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
        />
        <ResponsiveFigure
          src={`${CDN_URL}/day.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
        />
      </PageWrapper>
    </AppWithHeader>
  );
}
