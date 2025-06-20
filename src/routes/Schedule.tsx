import { PageWrapper } from '../components/PageWrapper';
import {
  TimelineBuilder,
  type TimelineItem,
} from '../components/TimelineBuilder';

const events: TimelineItem[] = [
  {
    date: 'November 20, 2025',
    title: 'Arrival',
    description:
      'Welcome to Sonoma! Settle in, relax and enjoy all the fruits the Valley has to offer. There is plenty to do in Sonoma but we have compiled a list of some of our favorites, including places to eat, drink, and enjoy. Check out our favorites below or click here.',
  },
  {
    date: 'November 20, 2025',
    title: 'Welcome Reception',
    time: '4:00pm',
    description:
      'Please join us for a happy hour reception where we can all see one another and meet those we haven’t before the big day. Hosted at the Fairmont Sonoma Mission Inn within their Harvest Pavilion room.',
  },
  {
    date: 'November 21, 2025',
    title: 'Wedding Ceremony',
    time: '4:30pm',
    description:
      'The ceremony will be followed by dinner, dancing, and celebration under the stars at the vineyard.',
  },
];

export default function Schedule() {
  return (
    <PageWrapper pageTitle="Schedule">
      <TimelineBuilder events={events} />
    </PageWrapper>
  );
}
