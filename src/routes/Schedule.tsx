import { FadeInOnLoad } from '../components/FadeInOnLoad';
import { PageWrapper } from '../components/PageWrapper';
import { ScheduleCore } from '../components/ScheduleCore';

export function Schedule() {
  return (
    <FadeInOnLoad>
      <PageWrapper pageTitle="Schedule">
        <ScheduleCore />
      </PageWrapper>
    </FadeInOnLoad>
  );
}
