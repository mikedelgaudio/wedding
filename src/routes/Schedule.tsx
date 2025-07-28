import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';
import { ScheduleCore } from '../components/ScheduleCore';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function Schedule() {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Schedule">
        <ResponsiveFigure
          src={`${CDN_URL}/chateau.jpg`}
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
