import type { JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { CollapsibleSection } from '../components/CollapsibleSection';
import { OpenInExternalLink } from '../components/OpenInExternalLink';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

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
                  We recommend renting a car for convenience, but ride-share
                  services are also available. Ride-shares are common to the
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
              <p className="mt-2">
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
                  near the Redmond Town Center.
                </li>
                <li>
                  <strong>Archer Hotel Redmond:</strong> A stylish hotel located
                  in downtown Redmond, offering modern amenities and easy access
                  to local attractions. Mike's parents actually stayed here and
                  loved it!
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
                If you prefer to stay in Seattle for tourist attractions and
                some great food, we recommend looking for hotels in the downtown
                area or near Fremont. This will give you easy access to the
                city's attractions and restaurants.
              </p>
              <p className="mt-2">
                Please note that Seattle is about a 30 minute drive to Redmond,
                not accounting for traffic. Traffic varies throughout the day
                and peaks during typical rush hours.
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
            <CollapsibleSection
              id="coffee"
              title="☕ Coffee"
              useSubHeading={true}
            >
              <ul className="list-disc pl-6 text-sm text-md flex flex-col gap-2">
                <li>
                  <strong>Lighthouse Roasters</strong> (Fremont, North Seattle)
                  - A beloved local roastery with great coffee and a laid-back
                  vibe.
                </li>
                <li>
                  <strong>Phe</strong> (Capitol Hill, Seattle) - Serving
                  Vietnamese coffee, matcha, hojicha, and delicious bánh
                  mì—definitely worth a stop.
                </li>
                <li>
                  <strong>Thruline</strong> (Kirkland) - Great cappuccinos and
                  just steps from the waterfront—perfect for a relaxing stroll.
                </li>
                <li>
                  <strong>Aroom</strong> (Above Gas Works Park, Seattle) - A
                  charming Vietnamese coffee shop with scenic views and cozy
                  ambiance.
                </li>
              </ul>
            </CollapsibleSection>
            <CollapsibleSection
              id="boba-tea"
              title="🧋 Boba Tea"
              useSubHeading={true}
            >
              <ul className="list-disc pl-6 text-sm text-md flex flex-col gap-2">
                <li>
                  <strong>HeyTea</strong> (Bellevue & Redmond coming soon) -
                  Lynh loves the Coconut Cloud Blue, Mike goes for the Matcha
                  Cloud Jasmine, and the Mango Boom (25% sweetness) is always a
                  hit.
                </li>
                <li>
                  <strong>Bobae</strong> (Kirkland & Woodinville) - One of our
                  top picks! They use locally sourced ingredients, full-leaf
                  teas, and make all toppings in-house. Try the NITRO OG Milk
                  Tea with 25% sweetness.
                </li>
                <li>
                  <strong>OMO Thai Tea</strong> (Bellevue) - We're obsessed with
                  the Thai Green Classic. Bonus: they also serve soft-serve ice
                  cream!
                </li>
                <li>
                  <strong>CHICHA San Chen</strong> (Bellevue) - Premium
                  Taiwanese tea with lots of customizable options—super smooth
                  and refreshing.
                </li>
              </ul>
            </CollapsibleSection>
            <CollapsibleSection
              id="favorite-food"
              title="🍽️ Favorite Food"
              useSubHeading={true}
            >
              <ul className="list-disc pl-6 text-sm text-md flex flex-col gap-2">
                <li>
                  <strong>A Ma Chicken Rice</strong> (Redmond) - Amazing
                  Hainanese chicken—simple, flavorful, and a must-try.
                </li>
                <li>
                  <strong>Isarn Thai Soul Kitchen</strong> (Kirkland) - One of
                  our favorites! Mike and I love the chicken soup (ask for
                  coconut milk) and the khao soi.
                </li>
                <li>
                  <strong>Din Tai Fung</strong> (Bellevue) - Famous for their
                  xiao long bao (soup dumplings)—a crowd-pleaser every time.
                </li>
                <li>
                  <strong>Matts' Rotisserie & Oyster Lounge</strong> (Redmond)
                  -s A favorite of Lynh's dad for fresh oysters and Mike's
                  parents for rotisserie chicken, and prime rib.
                </li>
              </ul>
            </CollapsibleSection>
            <CollapsibleSection
              id="outdoor-activities"
              title="⛰️ Hiking"
              useSubHeading={true}
            >
              <ul className="list-disc pl-6 text-sm text-md flex flex-col gap-2">
                <li>
                  <strong>Snoqualmie Falls:</strong> This is for those who want
                  to see a stunning 268-foot waterfall, without a strenuous
                  hike. This waterfall is wheelchair accessible (paved paths).
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
                  is about 30 minutes from Redmond. It offers stunning views of
                  Rattlesnake Lake and the surrounding mountains. The hike is
                  about 4 miles round trip with a moderate elevation gain. We
                  recommend using the jet lag to your advantage and waking up
                  early to do this hike to beat the crowds.
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
                  from Redmond and is only 2 miles round trip (about 1 hour and
                  20 minutes of hiking). It is well worth it for the views of
                  the beautiful Twin Falls.
                  <OpenInExternalLink
                    title="AllTrails"
                    url="https://www.alltrails.com/trail/us/washington/twin-falls-trail"
                  />
                </li>
                <li>
                  <strong>North Cascades National Park:</strong> if you're up
                  for a longer drive, the North Cascades are about 2 hours and
                  30 minutes away.
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
                  <strong>Mount Rainier National Park:</strong> Iconic views...{' '}
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
              useSubHeading={true}
            >
              <ul className="list-disc pl-6 text-sm text-md flex flex-col gap-2">
                <li>
                  <strong>Leavenworth:</strong> Step into a storybook Bavarian
                  village nestled in the mountains, just two hours from Seattle.
                  With its alpine charm, scenic views, outdoor adventures, and
                  year-round festivities, Leavenworth is perfect for a fun day
                  trip or a cozy overnight escape.
                </li>
                <li>
                  <strong>Vancouver B.C.:</strong> Ready for a road trip? Just
                  2.5 hours from Seattle you can visit Vancouver, British
                  Columbia with stunning cityscapes, world-class food, and a
                  blend of urban energy and natural beauty. Don't forget your
                  passport!
                </li>
                <li>
                  <strong>Pike's Place Market:</strong> A Seattle icon and a
                  feast for the senses! Wander through stalls filled with fresh
                  seafood, local produce, handmade goods, and street performers.
                  A perfect place to shop, snack, and soak up the city's vibe.
                </li>
                <li>
                  <strong>Ballard Farmer's Market:</strong> A local favorite
                  every Sunday, this lively market is full of fresh produce,
                  artisan treats, and handcrafted goods. Located in the charming
                  Ballard neighborhood, it's a great spot to spend a Sunday
                  morning.
                </li>
                <li>
                  <strong>Golden Gates Park:</strong> Enjoy breathtaking views
                  of the Puget Sound, sandy beaches, and forested trails.
                  Whether you're into beach picnics or sunset strolls, this
                  hidden gem is a peaceful escape from the city buzz.
                </li>
              </ul>
            </CollapsibleSection>
          </CollapsibleSection>
        </div>
      </PageWrapper>
    </AppWithHeader>
  );
}
