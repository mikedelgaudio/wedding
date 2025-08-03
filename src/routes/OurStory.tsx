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
          Lynh and Mike met during the summer of 2021 while interning at the
          same company in Redmond, WA. During orientation, interns were seated
          by the organization they'd be working for—and that's how Mike ended up
          next to Lynh. They exchanged a few words but didn't think much of it
          at the time. From what they remember, Lynh joked, “The only thing I
          know about Staten Island is that Pete Davidson is from there,” while
          Mike asked if Minnesota was <span className="italic">really</span>{' '}
          that cold.
        </p>
        <p className="text-lg">
          The very next day, as Lynh was walking back to her hotel with
          groceries, she ran into Mike again. As it turned out, not only were
          they working for the same company and same org—they were staying at
          the same hotel, on the same floor.
        </p>
        <p className="text-lg">
          In the evenings, the interns staying at the Residence Inn Redmond
          would often gather in the lobby to hang out and play games. One night,
          someone suggested poker—one of Lynh's favorite games. Mike had never
          played before, so Lynh offered to teach him… but not for free. With no
          poker chips, the interns resorted to verbal bets. Mike's first loss
          earned Lynh a week of rides to work (he was the only one who had
          rented a car that summer). That “week” quickly turned into the rest of
          the summer.
        </p>
        <p className="text-lg">
          Mike, ever proud of his air fryer purchase from Costco, boasted about
          using it to survive hotel living. So when he lost another hand, he
          upped the ante: he'd cook Lynh dinner. Skeptical—but also hungry—Lynh
          eventually took him up on the offer.
        </p>
        <p className="text-lg">
          Mike made a surprisingly good air fryer chicken dinner, and over
          dinner, they played another round of poker—just the two of them this
          time. After yet another loss, Mike decided to raise the stakes: “If I
          win the next hand, I get to take you out on a{' '}
          <span className="font-bold">proper date.</span>” Given his track
          record, Lynh didn't worry.
        </p>
        <p className="text-lg">But as fate would have it, Mike won.</p>
        <p className="text-lg">
          Let's just say the summer turned into a season of poker nights and
          food adventures around Seattle—one bet at a time.
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
