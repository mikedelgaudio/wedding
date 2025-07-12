import { Fragment } from 'react/jsx-runtime';
import GoogleMapsLink from './OpenInGoogleMaps';

export function ScheduleCore() {
  return (
    <Fragment>
      <div className="grid grid-cols-1 gap-6 border-b-1 border-[rgba(52,45,47,15%)] pb-8 px-4">
        <span className="text-2xl justify-self-end-safe">2:00 PM</span>
        <div>
          <h4 className="font-bold text-2xl">Ceremony</h4>
          <div>
            <p className="text-lg">Queen of All Saints Catholic Church</p>
            <p className="text-lg">
              2609 East 19th Street, Sheepshead Bay, NY, 11235, United States
            </p>
            <GoogleMapsLink address="1234 Restaurant Row, Brooklyn, NY, 11235, United States" />
            <p className="mt-6">Attire: Formal</p>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-[500px 1fr] gap-6 py-8 px-4">
        <span className="text-2xl justify-self-end-safe">
          5:30 PM - 11:00 PM
        </span>
        <div>
          <h4 className="font-bold text-2xl">Reception</h4>
          <div>
            <p className="text-lg">Bacchus Bistro</p>
            <p className="text-lg">
              1234 Restaurant Row, Brooklyn, NY, 11235, United States
            </p>
            <GoogleMapsLink address="1234 Restaurant Row, Brooklyn, NY, 11235, United States" />
            <p className="mt-6">Attire: Formal</p>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
