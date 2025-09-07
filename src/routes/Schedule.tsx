import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ScheduleCore } from '../components/ScheduleCore';

export function Schedule() {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Schedule">
        <p className="text-xl">
          We can't wait to celebrate with you! Below you'll find all the details
          to help you plan your day with us.
        </p>
        <ScheduleCore />
      </PageWrapper>
    </AppWithHeader>
  );
}
