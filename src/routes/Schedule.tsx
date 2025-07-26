import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';
import { ScheduleCore } from '../components/ScheduleCore';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function Schedule() {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Schedule for June 18, 2026">
        <ResponsiveFigure
          src={`${CDN_URL}/day.jpg`}
          alt=""
          width={583}
          height={300}
          loading="eager"
        />
        <ScheduleCore />
      </PageWrapper>
    </AppWithHeader>
  );
}
