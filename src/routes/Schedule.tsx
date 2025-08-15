import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ScheduleCore } from '../components/ScheduleCore';

export function Schedule() {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Schedule">
        <ScheduleCore />
      </PageWrapper>
    </AppWithHeader>
  );
}
