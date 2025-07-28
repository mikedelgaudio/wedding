import type { JSX } from 'react';
import { useRef, useState } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { OpenInExternalLink } from '../components/OpenInExternalLink';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

type CollapsibleSectionProps = {
  id: string;
  title: string;
  children: JSX.Element | JSX.Element[];
  titleclassName?: string; // Add className prop
};

function CollapsibleSection({
  id,
  title,
  children,
  titleclassName,
}: CollapsibleSectionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  return (
    <div className="border-b border-gray-300 pb-4">
      <button
        id={`toggle-${id}`}
        onClick={() => setIsOpen(prev => !prev)}
        className={`cursor-pointer text-2xl font-bold mt-2 w-full text-left flex justify-between items-center focus:outline-none focus-visible:ring focus-visible:ring-black-500 rounded`}
        aria-expanded={isOpen}
        aria-controls={`content-${id}`}
      >
        <span className={titleclassName || 'text-xl font-semibold'}>
          {title}
        </span>
        <span className="text-xl">{isOpen ? '−' : '+'}</span>
      </button>

      <div
        ref={contentRef}
        id={`content-${id}`}
        role="region"
        aria-labelledby={`toggle-${id}`}
        className={`overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="mt-2">{children}</div>
      </div>
    </div>
  );
}

export function Travel(): JSX.Element {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Travel">
        <div className="flex flex-col gap-4 text-lg">
          <p>
            We are excited to welcome you to the Pacific Northwest for our
            wedding! We have lived in Redmond for over 3 years and are happy to
            share some travel tips and recommendations while you're in the area.
          </p>
          <ResponsiveFigure
            src={`${CDN_URL}/redmond.jpg`}
            height={400}
            width={1000}
            alt=""
            loading="eager"
          />
          <p>
            Redmond is located just east of Seattle and is known for its
            beautiful parks, access to nature, and accessible food options to
            Seattle and surrounding cities (Bellevue, Kirkland, Woodinville). We
            hope that you'd take this opportunity to explore the area while
            you're here since it is some of the best times of the year to visit!
          </p>

          <CollapsibleSection id="getting-here" title="Getting Here">
            <>
              <p>
                We understand that many of you will be traveling from out of
                town and thank you for considering making the trip to celebrate
                with us. We want to make your journey as smooth as possible.
              </p>
              <ul className="list-disc pl-6 text-lg">
                <li>
                  The closest international airport to Redmond is Seattle-Tacoma
                  International Airport (SEA).
                </li>
                <li>
                  We recommend renting a car for convenience, but rideshare
                  services are also available. Rideshares are common to the
                  airport and local areas near your accommodations, but if
                  you're interested in visiting Seattle, crossing the lake can
                  cost a premium and makes it less practical than renting a car.
                </li>
                <li>
                  There are several accommodation options in the area Redmond,
                  Seattle and neighboring cities, and all depends on your
                  preferences.
                </li>
              </ul>
            </>
          </CollapsibleSection>

          <CollapsibleSection id="accommodations" title="Accommodations">
            <>
              <p>
                We have compiled a list of recommended accommodations in the
                Redmond and Seattle area. Some of these options are located in
                Redmond, which is closer to the wedding venue, while others are
                in Seattle, which is about a 30 minute drive from Redmond not
                accounting for traffic.
              </p>

              <h3 className="text-xl font-bold mt-4">Redmond Accommodations</h3>
              <p>
                If you prefer to stay in Redmond, we recommend looking for
                hotels near the Redmond Town Center or the venue. This will give
                you easy access to the wedding festivities and local
                attractions.
              </p>
              <p>
                Redmond Town Center is a popular shopping and dining destination
                with a variety of options to choose from with a large amount of
                hotels features a walkable area with restaurants, shops, and
                parks. It is also conveniently located near the wedding venue
                with a 10 minute drive.
              </p>
              <ul className="list-disc pl-6 text-lg">
                <li>
                  <strong>Marriott Residence Inn Seattle East/Redmond: </strong>
                  This is the hotel that we both stayed for 3 months when we
                  were interns. It offers spacious suites with kitchenettes (hot
                  plates and fridge), complimentary breakfast, and is located
                  near the Redmond Town Center.{' '}
                  <OpenInExternalLink
                    title="More Info"
                    url="https://www.marriott.com/en-us/hotels/seard-residence-inn-seattle-east-redmond/overview/"
                  />
                </li>
                <li>
                  <strong>Archer Hotel Redmond:</strong> A stylish hotel located
                  in downtown Redmond, offering modern amenities and easy access
                  to local attractions. Mike's parents actually stayed here and
                  loved it! {''}
                  <OpenInExternalLink
                    title="Archer Hotel Redmond"
                    url="https://archerhotel.com/redmond"
                  />
                </li>
                <li>
                  <strong>Hyatt House Seattle/Redmond:</strong> A modern hotel
                  with spacious rooms and a complimentary breakfast, located
                  near the wedding venue.
                  <OpenInExternalLink
                    title="Hyatt House Seattle/Redmond"
                    url="https://www.hyatt.com/en-US/hotel/washington/hyatt-house-seattle-redmond/seahr"
                  />
                </li>
                <li>
                  <strong>Airbnb Options:</strong> There are many Airbnb options
                  in the area, ranging from private rooms to entire homes. We
                  recommend checking Airbnb for availability and options that
                  suit your needs.
                </li>
              </ul>

              <h3 className="text-xl font-bold mt-4">Seattle Accommodations</h3>
              <p>
                If you prefer to stay in Seattle, we recommend looking for
                hotels in the downtown area or near the waterfront. This will
                give you easy access to the city's attractions and restaurants.
                Please check Google Maps for projected travel times to Redmond,
                as traffic can vary depending on the time of day.
              </p>

              <h3 className="text-xl font-bold mt-4">
                Other neighboring cities to consider
              </h3>
              <p>
                If you are open to staying in neighboring cities, we recommend
                considering Bellevue, Kirkland, or Woodinville. These cities are
                close to Redmond and offer a variety of accommodations and
                dining options.
              </p>
              <p>
                Bellevue is known for its upscale shopping and dining, while
                Kirkland offers a charming waterfront area with parks and
                restaurants. Woodinville is famous for its wineries and
                breweries, making it a great option for those interested in
                exploring the local beverage scene.
              </p>
            </>
          </CollapsibleSection>

          <CollapsibleSection id="things-to-do" title="Things to Do">
            <>
              <CollapsibleSection
                id="coffee"
                title="☕ Coffee"
                titleclassName="text-base font-medium"
              >
                <>
                  <ul className="list-disc pl-6 text-sm">
                    <li>
                      <strong>Lighthouse Roasters</strong> Located in Fremont
                      (North Seattle)
                    </li>
                    <li>
                      <strong>Phe</strong> Located in Capitol Hill, Seattle.
                      This shop serves both Vietnamese Coffee, matcha, hojicha,
                      and some great Bahn Mi.
                    </li>
                    <li>
                      <strong>Thruline</strong> Located in Kirkland (about 15
                      minutes west of Redmond), grab a cappuccino and stroll
                      through the waterfront.
                    </li>
                    <li>
                      <strong>Aroom</strong> a Vietnamese coffee shop located
                      above the famous Gas Works Park in Seattle.
                    </li>
                  </ul>
                </>
              </CollapsibleSection>

              <CollapsibleSection
                id="boba-tea"
                title="🧋 Boba Tea"
                titleclassName="text-base font-medium"
              >
                <>
                  <ul className="list-disc pl-6 text-sm">
                    <li>
                      <strong>HeyTea</strong> Located in Bellevue (with a
                      Redmond location opening soon). Lynh's favorite is the
                      Coconut Cloud Blue and Mike's is the Matcha Cloud Jasmine.
                      The Mango Boom with reduced sweetness is also a great
                      option!
                    </li>
                    <li>
                      <strong>Bobae</strong> Located in both Kirkland and
                      Woodinville, this is one of our favorite boba shops in the
                      area. Locally sourced ingredients, all toppings and syrups
                      made in store, only using full leaf teas. Our go to is the
                      NITRO OG Milk Tea with 25% sweetness.
                    </li>
                    <li>
                      <strong>OMO Thai Tea</strong> Located in Bellevue, this
                      has one of our favorite drinks: the Thai Green Classic.
                      They also have soft serve ice cream!
                    </li>
                    <li>
                      <strong>CHICHA San Chen</strong>
                    </li>
                  </ul>
                </>
              </CollapsibleSection>

              <CollapsibleSection
                id="favorite-food"
                title="🍽️ Favorite Food"
                titleclassName="text-base font-medium"
              >
                <>
                  <ul className="list-disc pl-6 text-sm">
                    <li>
                      <strong>A Ma Chicken Rice</strong> Located in Redmond.
                      This spot has some killer Hainanese chicken!
                    </li>
                    <li>
                      <strong>Isarn Thai Soul Kitchen</strong> Located in
                      Kirkland, this is a restaurant Mike and I love especially
                      for their chicken soup (ask to add coconut milk) and their
                      khao soi.
                    </li>
                    <li>
                      <strong>Din Tai Fung</strong> Located in Bellevue, this
                      has some great best soup dumplings (xiao long bao)!
                    </li>
                    <li>
                      <strong>Matts' Rotisserie & Oyster Lounge</strong> Located
                      in Redmond, this spot is a favorite of Lynh's dad for
                      Oysters, Rotisserie chicken, and prime rib.
                    </li>
                  </ul>
                </>
              </CollapsibleSection>

              <CollapsibleSection
                id="outdoor-activities"
                title="⛰️ Hiking"
                titleclassName="text-base font-medium"
              >
                <ul className="list-disc pl-6 text-sm">
                  <li>
                    <strong>Snoqualmie Falls:</strong> This is for those who
                    want to see a stunning 268-foot waterfall, without a
                    strenuous hike. This waterfall is wheelchair accessible
                    (paved paths).
                    <OpenInExternalLink
                      title="AllTrails"
                      url="https://www.alltrails.com/trail/us/washington/snoqualmie-falls-trail"
                    />
                  </li>
                  <ResponsiveFigure
                    src={`${CDN_URL}/snoqualmie.jpg`}
                    alt=""
                    width={1000}
                    height={400}
                    loading="lazy"
                  />
                  <li>
                    <strong>Rattlesnake Ledge:</strong> A very popular hike that
                    is about 30 minutes from Redmond. It offers stunning views
                    of Rattlesnake Lake and the surrounding mountains. The hike
                    is about 4 miles round trip with a moderate elevation gain.
                    We recommend using the jet lag to your advantage and waking
                    up early to do this hike to beat the crowds.
                    <OpenInExternalLink
                      title="AllTrails"
                      url="https://www.alltrails.com/trail/us/washington/rattlesnake-ledge"
                    />
                  </li>
                  <ResponsiveFigure
                    src={`${CDN_URL}/rattlesnake.jpg`}
                    alt=""
                    width={1000}
                    height={400}
                    loading="lazy"
                    caption="July 2025 with Liem (Lynh's brother)"
                  />
                  <li>
                    <strong>Twin Falls:</strong> This hike is about 40 minutes
                    from Redmond and is only 2 miles round trip (about 1 hour
                    and 20 minutes of hiking). It is well worth it for the views
                    of the beautiful Twin Falls.
                    <OpenInExternalLink
                      title="AllTrails"
                      url="https://www.alltrails.com/trail/us/washington/twin-falls-trail"
                    />
                  </li>
                  <li>
                    <strong>
                      North Cascades National Park: if you're up for a longer
                      drive, the North Cascades are about 2 hours and 30 minutes
                      away.
                    </strong>
                  </li>
                  <ResponsiveFigure
                    src={`${CDN_URL}/diabloLake.jpg`}
                    alt=""
                    width={1000}
                    height={400}
                    loading="lazy"
                    caption="July 2023 at Diablo Lake"
                  />
                  <li>
                    <strong>Mount Rainier National Park:</strong> Iconic
                    views...{' '}
                    <OpenInExternalLink
                      title="AllTrails"
                      url="https://www.alltrails.com/trail/us/washington/skyline-trail"
                    />
                  </li>
                  <ResponsiveFigure
                    src={`${CDN_URL}/rainer.jpg`}
                    alt=""
                    width={1000}
                    height={400}
                    loading="lazy"
                  />
                </ul>
              </CollapsibleSection>
              <CollapsibleSection
                id="Outdoor-attractions"
                title="Other Attractions"
                titleclassName="text-base font-medium"
              >
                <ul className="list-disc pl-6 text-sm">
                  <li>
                    <strong>Leavenworth:</strong> A charming Bavarian-style
                    village located about 2 hours from Seattle. It's known for
                    its beautiful scenery, outdoor activities, and festive
                    atmosphere.
                  </li>
                  <li>
                    <strong>Vancouver:</strong> If you're up for a road trip,
                    consider visiting Vancouver, Canada. It's about a 2.5 hour
                    drive away from Seattle.
                  </li>
                  <li>
                    <strong>Pike's Place Market:</strong> A must-visit
                    destination in Seattle, known for its fresh produce,
                    seafood, and local crafts. It's a great place to explore and
                    grab a bite to eat.
                  </li>
                  <li>
                    <strong>Ballard Farmer's Market:</strong> A popular weekend
                    market in Seattle's Ballard neighborhood, featuring local
                    produce, handmade goods, and delicious food vendors.
                  </li>
                  <li>
                    <strong>Golden Gates Park:</strong> Stunning views of the
                    Puget Sound. It's a great place to take a leisurely stroll.
                  </li>
                </ul>
              </CollapsibleSection>
            </>
          </CollapsibleSection>
        </div>
      </PageWrapper>
    </AppWithHeader>
  );
}
