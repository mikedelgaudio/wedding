import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { ScheduleCore } from '../components/ScheduleCore';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function Schedule() {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Schedule">
        <ScheduleCore />
        <img
          src={`${CDN_URL}/chateau.png`}
          className="object-contain w-full h-[300px]"
          alt=""
          height={300}
          loading="eager"
          width={583}
        />
      </PageWrapper>
    </AppWithHeader>
  );
}
