import type { JSX } from 'react';
import img from '../assets/ourstory.jpg';
import { PageWrapper } from '../components/PageWrapper';

export function OurStory(): JSX.Element {
  return (
    <PageWrapper pageTitle="Our Story">
      <p>
        Lynh and Mike met in 2022 while Lorem ipsum dolor sit, amet consectetur
        adipisicing elit. Incidunt nulla cumque omnis inventore vel voluptatibus
        laudantium cupiditate fuga impedit aliquid necessitatibus sapiente eum
        dolore nihil, ipsum sed ratione! Eligendi, quasi!
      </p>
      <p>
        Lorem ipsum dolor, sit amet consectetur adipisicing elit. Quod rem vel
        explicabo eaque dolor cum ipsum voluptatibus aliquam asperiores?
        Voluptatum molestias ducimus quod minus totam officia quasi numquam
        eligendi ipsam?
      </p>
      <img
        src={img}
        alt=""
        width={1000}
        height={665}
        className="w-full max-w-2xl mx-auto rounded-lg shadow-lg"
      />
    </PageWrapper>
  );
}
