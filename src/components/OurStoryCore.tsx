import type { JSX } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveFigure } from './ResponsiveFigure';
import { AnimatedElement } from './animation/AnimatedElement';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function OurStoryCore(): JSX.Element {
  return (
    <div className="pt-1 relative">
      <AnimatedElement
        as="h2"
        delay={0}
        duration={200}
        animationType="fade-up"
        style={{ fontFamily: '"Tangerine", serif' }}
        className="text-6xl my-4 md:text-8xl text-center"
      >
        Our Story
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        style={{ fontFamily: '"Tangerine", serif' }}
      >
        <ResponsiveFigure
          src={`${CDN_URL}/public-hero.jpg`}
          alt=""
          width={583}
          height={300}
          loading="eager"
        />
      </AnimatedElement>

      <AnimatedElement
        as="p"
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="text-xl mt-6"
      >
        <span className="font-bold text-3xl">Lynh & Michael</span> both happened
        to be in Washington interning for the same company one summer. During
        orientation, interns were seated by table of the organization they'd be
        working for—and that's how Michael ended up next to Lynh. They exchanged
        a few words but didn't think much of it at the time. From what they
        remember, Lynh joked, “If you're from Staten Island, are you related to
        Pete Davidson?” while Michael asked if Lynh's house in Minnesota looked
        like an igloo.
      </AnimatedElement>
      <AnimatedElement
        delay={50}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
      >
        <p className="text-xl my-4">
          The very next day, as Lynh was walking back to her hotel with
          groceries, she ran into Michael again. As it turned out, not only were
          they working for the same company in the same organization—they were
          staying at the same hotel, on the same floor.
        </p>
        <AnimatedElement
          as="h2"
          delay={0}
          duration={200}
          animationType="fade-up"
          rootMargin="100px"
          className="text-5xl my-4"
          style={{ fontFamily: 'Tangerine' }}
        >
          🂱 A Game of Poker
        </AnimatedElement>
        <p className="text-xl my-4">
          In the evenings, the people staying at the hotel would often gather in
          the lobby to hang out and play games. One night, someone suggested
          poker—one of Lynh's favorite games. Michael had never played before,
          so Lynh offered to teach him… but not for free.
        </p>
        <p className="text-xl my-4">
          With no poker chips, they resorted to verbal bets. Michael's first
          loss earned Lynh a week of rides to work (he had taken the rental car
          option while Lynh took the transportation stipend option). That “week”
          quickly turned into the rest of the summer.
        </p>
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
      >
        <p className="text-xl my-4">
          Michael, ever proud of his air fryer purchase from Costco, boasted
          about using it to survive hotel living. So when he lost another hand,
          he upped the ante: he'd cook Lynh dinner. Skeptical—but also
          hungry—Lynh eventually took him up on the offer.
        </p>
        <p className="text-xl my-4">
          Michael made a surprisingly good air fryer chicken dinner, and over
          dinner, they played another round of poker—just the two of them this
          time. After yet another loss, Michael decided to raise the stakes: “If
          I win the next hand, I get to take you out on a{' '}
          <span className="font-bold">proper date.</span>” Given his track
          record, Lynh didn't worry.
        </p>
      </AnimatedElement>
      <AnimatedElement
        as="p"
        delay={0}
        duration={200}
        animationType="fade-up"
        className="text-xl my-4"
        rootMargin="100px"
      >
        But as fate would have it, Michael won.
      </AnimatedElement>
      <AnimatedElement
        as="p"
        delay={0}
        duration={200}
        animationType="fade-up"
        className="text-xl my-4"
        rootMargin="100px"
      >
        Let's just say the summer turned into a season of poker nights and food
        adventures around Seattle—one bet at a time.
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
      >
        <ResponsiveFigure
          src={`${CDN_URL}/museum.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Our third date at the Chihuly Glass Museum"
        />
      </AnimatedElement>
      <AnimatedElement
        as="h2"
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="text-5xl my-4"
        style={{ fontFamily: 'Tangerine' }}
      >
        ✈️ Long distance... kinda?
      </AnimatedElement>
      <AnimatedElement
        as="p"
        delay={0}
        duration={200}
        animationType="fade-up"
        className="text-xl my-4"
      >
        After the summer ended, Michael returned to New York and Lynh returned
        to Minnesota to finish their last year of school, each visiting each
        other... a lot.
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
      >
        <ResponsiveFigure
          src={`${CDN_URL}/MichaelSnow.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Michael experiencing his first MN Snow"
        />
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="mt-4"
      >
        <ResponsiveFigure
          src={`${CDN_URL}/timesSquare.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="Timesquare 2022"
        />
      </AnimatedElement>
      <AnimatedElement
        as="h2"
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="text-5xl my-4"
        style={{ fontFamily: 'Tangerine' }}
      >
        ⛰️ Washington Living
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="text-xl grid gap-4 my-4"
      >
        <p>
          After college, Michael and Lynh both returned to Washington for work
          and have been living there ever since! They enjoy going on hikes with
          their friends and trying new coffee/tea spots, (see recommendations in
          the{' '}
          <Link
            to="/travel"
            className="font-bold underline hover:no-underline focus-visible:outline-2"
          >
            Things To Do section
          </Link>
          ).
        </p>
        <ResponsiveFigure
          src={`${CDN_URL}/diabloLake.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
          caption="July 2023 at Diablo Lake"
        />
      </AnimatedElement>
      <AnimatedElement
        as="h2"
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="text-5xl my-4"
        style={{ fontFamily: 'Tangerine' }}
      >
        🌷 The Proposal
      </AnimatedElement>
      <AnimatedElement
        as="p"
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
        className="text-xl my-4"
      >
        Every year since moving to Washington, Lynh & Michael attend the annual
        Tulip Festival in Northern Washington. It it one of Lynh's favorite
        places on Earth. For her birthday, Michael surprised Lynh with a couples
        photoshoot at the festival. However, Michael had more planned than just
        a photoshoot.
      </AnimatedElement>
      <AnimatedElement
        delay={0}
        duration={200}
        animationType="fade-up"
        rootMargin="100px"
      >
        <p className="text-xl my-4">
          On April 4th, 2025 Michael proposed in front of the first blooms of
          Spring.
        </p>
        <ResponsiveFigure
          src={`${CDN_URL}/proposal.jpg`}
          alt=""
          width={1000}
          height={400}
          loading="lazy"
        />
      </AnimatedElement>
    </div>
  );
}
