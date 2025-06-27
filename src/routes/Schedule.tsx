import { PageWrapper } from '../components/PageWrapper';
import {
  TimelineBuilder,
  type TimelineItem,
} from '../components/TimelineBuilder';

const events: TimelineItem[] = [
  {
    date: 'June 18th, 2026',
    title: 'Ceremony Arrival',
    time: '2:00pm - 2:30pm',
    description: 'Queen of All Saints Catholic Church',
  },
  {
    date: 'June 18th, 2026',
    title: 'Ceremony',
    time: '2:30pm - 4:00pm',
    description: 'Queen of All Saints Catholic Church',
  },
  {
    date: 'June 18th, 2026',
    title: 'After Ceremony Group Photo',
    time: '4:00pm - 4:30pm',
    description: 'Queen of All Saints Catholic Church',
  },
  {
    date: 'June 18th, 2026',
    title: 'Commute to Reception',
    time: '4:30pm - 5:00pm',
    description: 'Please make your way to Bacchus Bistro in Brooklyn.',
  },
  {
    date: 'June 18th, 2026',
    title: 'Amuse Bouche Service',
    time: '5:00pm - 6:00pm',
    description:
      'Please join us for our reception at Bacchus Bistro, a french restaurant in Brooklyn. There we will have a amuse bouche service, 4 course dinner, and an open bar.',
  },
  {
    date: 'June 18th, 2026',
    title: 'Dinner Service',
    time: '6:00pm - 7:30pm',
    description: '4 course dinner',
  },
  {
    date: 'June 18th, 2026',
    title: 'Cake Cutting/Dessert Service',
    time: '7:30pm - 8:30pm',
    description: 'Cake cutting and dessert service',
  },
  {
    date: 'June 18th, 2026',
    title: 'Dancing and Celebration',
    time: '8:30pm - 11:00pm',
    description: 'Dance the night away with us!',
  },
];

export default function Schedule() {
  return (
    <PageWrapper pageTitle="Schedule">
      <TimelineBuilder events={events} />
    </PageWrapper>
  );
}
