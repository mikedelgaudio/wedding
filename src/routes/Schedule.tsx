import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ScheduleCore } from '../components/ScheduleCore';

export function Schedule() {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Schedule">
        <p className="text-xl">
          We're so excited to celebrate with you! Below you'll find all the
          details you need to plan your day with us.
        </p>
        <ScheduleCore />
      </PageWrapper>
    </AppWithHeader>
  );
}
