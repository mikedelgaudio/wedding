import { useCallback, useState, type JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { AccordionItem } from '../components/AccordianItem';
import { OpenInExternalLink } from '../components/OpenInExternalLink';
import { PageWrapper } from '../components/PageWrapper';
import { ResponsiveFigure } from '../components/ResponsiveFigure';

const CDN_URL = import.meta.env.VITE_REACT_APP_ASSET_CDN_URL;

export function Travel(): JSX.Element {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});

  const toggleSection = useCallback((id: string) => {
    setOpenSections(prev => ({
      ...prev,
      [id]: !prev[id],
    }));
  }, []);

  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Travel">
        <div className="flex flex-col gap-4 text-xl">
          <p>
            We are excited to welcome you to the Pacific Northwest for our
            wedding! After living in Redmond for the past few years, we are
            delighted to share our favorite travel tips and recommendations to
            help you make the most of your visit.
          </p>
          <ResponsiveFigure
            src={`${CDN_URL}/redmond.jpg`}
            height={400}
            width={1000}
            alt=""
            loading="eager"
          />
          <p>
            Redmond is just east of Seattle and is known for its beautiful
            parks, abundant nature, and convenient access to great dining in and
            around nearby cities such as Bellevue, Kirkland, and Woodinville. We
            hope you take this opportunity to explore the area while you are
            here, as this is one of the best times of the year to visit.
          </p>

          <AccordionItem
            id="getting-here"
            title="Getting Here"
            isOpen={!!openSections['getting-here']}
            onToggle={() => toggleSection('getting-here')}
          >
            <>
              <p>
                We understand that many of you will be traveling from out of
                town and thank you for considering making the trip to celebrate
                with us.
              </p>
              <ul className="list-disc pl-6 text-lg">
                <li>
                  The closest international airport to Redmond is Seattle-Tacoma
                  International Airport (SEA).
                </li>
                <li>
                  We recommend renting a car for convenience, but ride-share
                  services are also available. Ride-shares are common to the
                  airport and local areas near your accommodations.
                </li>
                <li>
                  There are plentiful accommodation options in Redmond and
                  neighboring cities (Bellevue, Kirkland, Woodinville), and it
                  all depends on your preferences.
                </li>
              </ul>
            </>
          </AccordionItem>

          <AccordionItem
            id="accommodations"
            title="Accommodations"
            isOpen={!!openSections['accommodations']}
            onToggle={() => toggleSection('accommodations')}
          >
            <>
              <p>
                We have compiled a list of recommended accommodations in the
                Downtown Redmond and Woodinville area. These options are the
                easiest to access for the wedding festivities.
              </p>
              <div className="p-4 mt-2 bg-blue-100 rounded-xl flex gap-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="800"
                  height="800"
                  className="w-12 h-auto"
                  fill="none"
                  viewBox="-0.5 0 25 25"
                >
                  <path
                    stroke="#000"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.5"
                    d="M12 21.5A9.25 9.25 0 1 0 12 3a9.25 9.25 0 0 0 0 18.5Z"
                  />
                  <path
                    fill="#000"
                    d="M12.93 8.15a.92.92 0 0 1-.93.9.9.9 0 1 1 .93-.9Zm-1.64 8.38v-5.38a.7.7 0 0 1 .71-.72.689.689 0 0 1 .69.72v5.38a.701.701 0 0 1-1.4 0Z"
                  />
                </svg>{' '}
                <p>
                  We recommend staying in Redmond/Woodinville or neighboring
                  cities such as Kirkland to avoid traffic during rush hour. We
                  would not recommend staying in Seattle due to traffic from the
                  World Cup.
                </p>
              </div>
              <h3 className="text-xl font-bold mt-4">
                Woodinville Accommodations
              </h3>
              <p>
                Woodinville is famous for its wineries and breweries, making it
                a great option for those interested in exploring the local
                beverage scene. It is also the closest to the reception venue.
              </p>
              <ul className="list-disc pl-6 text-lg">
                <li>
                  <a
                    href="https://thesomm.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  >
                    <strong>
                      The SOMM Hotel & Spa, Autograph Collection (Marriott):
                    </strong>
                  </a>{' '}
                  This is the hotel that we have a hotel block at. It is the
                  closest hotel to the reception venue, about a 1 minute drive.
                  We highly recommend booking early if you are interested, as
                  space is limited. If the hotel block is full, don't worry -
                  there are plenty of excellent accommodations throughout the
                  area.
                </li>
                <li>
                  <a
                    href="https://www.willowslodge.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  >
                    <strong>Willows Lodge:</strong>
                  </a>{' '}
                  A beautiful lodge-style hotel located in the heart of
                  Woodinville, offering a cozy and intimate atmosphere. About a
                  3 minute drive from the reception venue.
                </li>
              </ul>
              <h3 className="text-xl font-bold mt-4">Redmond Accommodations</h3>
              <p>
                If you prefer to stay in Redmond, we recommend looking for
                hotels near the Redmond Town Center. This will give you easy
                access to attractions by foot. It is also conveniently located
                near the wedding venue with a 10 minute drive.
              </p>
              <ul className="list-disc pl-6 text-lg">
                <li>
                  <a
                    href="https://www.marriott.com/en-us/hotels/seard-residence-inn-seattle-east-redmond/overview/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  >
                    <strong>Marriott Residence Inn Redmond:</strong>
                  </a>{' '}
                  This is the hotel that we both stayed for 3 months when we
                  were interns. It offers spacious suites with kitchenettes (hot
                  plates and fridge), complimentary breakfast, and is located
                  near the Redmond Town Center.
                </li>
                <li>
                  <a
                    href="https://archerhotel.com/redmond"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  >
                    <strong>Archer Hotel Redmond:</strong>
                  </a>{' '}
                  A stylish hotel located in Downtown Redmond, offering modern
                  amenities and easy access to local attractions. Mike's parents
                  actually stayed here and loved it!
                </li>
                <li>
                  <a
                    href="https://www.marriott.com/en-us/hotels/seamc-seattle-marriott-redmond/overview/"
                    target="_blank"
                    rel="noreferrer"
                    className="underline hover:no-underline focus-visible:border focus-visible:border-gray-950 focus:outline-none focus-visible:rounded-lg"
                  >
                    <strong>Seattle Marriott Redmond:</strong>
                  </a>{' '}
                  Another great option neighboring with the Redmond Town Center
                  and Marriott Residence Inn Redmond hotel.
                </li>
                <li>
                  <strong>Airbnb Options:</strong> There are many Airbnb options
                  in the area, ranging from private rooms to entire homes. We
                  recommend checking Airbnb for availability and options that
                  suit your needs.
                </li>
              </ul>
              <h3 className="text-xl font-bold mt-4">
                Other neighboring cities to consider
              </h3>
              <p>
                If you are open to staying in neighboring cities, we recommend
                considering Bellevue or Kirkland. These cities are close to
                Redmond and offer a variety of accommodations and dining
                options.
              </p>
              <p className="mt-2">
                Bellevue is known for its upscale shopping and dining, while
                Kirkland offers a charming waterfront area with parks and
                restaurants. Please check Google Maps and some of the local
                guides on YouTube for a better visualization of the area.
              </p>
            </>
          </AccordionItem>
          <AccordionItem
            id="things-to-do"
            title="Things to Do"
            isOpen={!!openSections['things-to-do']}
            onToggle={() => toggleSection('things-to-do')}
          >
            <p>
              There are plenty of things to do in and around Redmond. We tried
              to keep our reccomendations more focused on the Eastside as going
              into Seattle might be a bit busy due to the World Cup, but there
              are still many attractions and activities to enjoy in the area.
              Here are some of our top recommendations:
            </p>
            <div className="flex flex-col gap-4">
              <AccordionItem
                id="coffee"
                title="☕ Coffee"
                isOpen={!!openSections['coffee']}
                onToggle={() => toggleSection('coffee')}
                useSubHeading
              >
                <ul className="list-disc pl-6  text-md flex flex-col gap-2">
                  <li>
                    <strong>Lighthouse Roasters:</strong> (Fremont, North
                    Seattle) - Our favorite spot for coffee! They roast their
                    own beans.
                  </li>
                  <li>
                    <strong>Phe:</strong> (Capitol Hill, Seattle) - Serving
                    Vietnamese coffee, matcha, hojicha, and delicious bánh
                    mì—definitely worth a stop.
                  </li>
                  <li>
                    <strong>Thruline:</strong> (Kirkland) - Great cappuccinos
                    and just steps from the waterfront—perfect for a relaxing
                    stroll.
                  </li>
                  <li>
                    <strong>Aroom:</strong> (Above Gas Works Park, Seattle) - A
                    charming Vietnamese coffee shop with scenic views and cozy
                    ambiance.
                  </li>
                  <li>
                    <strong>5 Stones Coffee Co:</strong> (Redmond) -
                    Specifically their Cafe Stefano, vanilla + hazelnut syrup,
                    ceylon cinnamon steamed into the milk & a zest of orange.
                    Service tend to be on the slower side.
                  </li>
                  <li>
                    <strong>Cafe Hagen:</strong> (Bellevue) - A Scandinavian
                    coffee shop. If you want to try something different, go for
                    their København latte which has hints of cardamom and
                    almond. Their food platters are also fun for
                    breakfast/brunch.
                  </li>
                </ul>
              </AccordionItem>
              <AccordionItem
                id="boba-tea"
                title="🧋 Boba Tea"
                isOpen={!!openSections['boba-tea']}
                onToggle={() => toggleSection('boba-tea')}
                useSubHeading
              >
                <ul className="list-disc pl-6  text-md flex flex-col gap-2">
                  <li>
                    <strong>HeyTea:</strong> (Bellevue & Redmond coming soon) -
                    Lynh loves the Coconut Cloud Blue, Mike goes for the Matcha
                    Cloud Jasmine, and the Mango Boom (25% sweetness) is always
                    a hit.
                  </li>
                  <li>
                    <strong>Yezi Coconut Dessert:</strong> (Bellevue Mall) - If
                    you like real coconut as much as Lynh, this place was made
                    for you. We like their puddings and their Mango Coconut
                    Snowy (order less sweetness).
                  </li>
                  <li>
                    <strong>Bobae:</strong> (Kirkland & Woodinville) - One of
                    our top picks! They use locally sourced ingredients,
                    full-leaf teas, and make all toppings in-house. Try the
                    NITRO OG Milk Tea with 25% sweetness.
                  </li>
                  <li>
                    <strong>OMO Thai Tea:</strong> (Bellevue) - We're obsessed
                    with the Thai Green Classic. Bonus: they also serve
                    soft-serve ice cream!
                  </li>
                  <li>
                    <strong>CHICHA San Chen:</strong> (Bellevue) - Premium
                    Taiwanese tea with lots of customizable options—super smooth
                    and refreshing. Our favorite is the oolong tea + orange.
                  </li>
                </ul>
              </AccordionItem>
              <AccordionItem
                id="favorite-food"
                title="🍽️ Food"
                isOpen={!!openSections['favorite-food']}
                onToggle={() => toggleSection('favorite-food')}
                useSubHeading
              >
                <ul className="list-disc pl-6  text-md flex flex-col gap-2">
                  <li>
                    <strong>A Ma Chicken Rice:</strong> (Redmond) - Amazing
                    Hainanese chicken—simple, flavorful, and a must-try.
                  </li>
                  <li>
                    <strong>Isarn Thai Soul Kitchen:</strong> (Kirkland) - One
                    of our favorites! We love the chicken soup (ask for coconut
                    milk) and the khao soi.
                  </li>
                  <li>
                    <strong>DERU:</strong> (Kirkland) - Our favorite brunch
                    spot. Get on the waitlist early!
                  </li>
                  <li>
                    <strong>Von's 1000 Spirits:</strong> (Woodinville) - Great
                    sourdough pasta and lots of drink options if that's
                    something you're into!
                  </li>
                  <li>
                    <strong>Anh and Chi:</strong> (Vancouver) - If you want
                    Vietnamese food, this is the place. Lynh loves their Gỏi Bắp
                    Chuối Cua Lột - Soft Shell Crab Salad and Phở Hoàng - Beef
                    Noodle Soup
                  </li>
                  <li>
                    <strong>Din Tai Fung:</strong> (Bellevue) - Famous for their
                    xiao long bao (soup dumplings), Mike loves the pork
                    dumplings. Lynh likes their Braised Beef Noodle Soup. A more
                    affordable option is Dough Zone which is also pretty good.
                  </li>
                  <li>
                    <strong>Matts' Rotisserie & Oyster Lounge:</strong>{' '}
                    (Redmond) A favorite of Lynh's dad for fresh oysters and
                    Mike's parents for rotisserie chicken, and prime rib.
                  </li>
                </ul>
              </AccordionItem>
              <AccordionItem
                id="outdoor-activities"
                title="⛰️ Hiking"
                isOpen={!!openSections['outdoor-activities']}
                onToggle={() => toggleSection('outdoor-activities')}
                useSubHeading
              >
                <ul className="list-disc pl-6  text-md flex flex-col gap-2">
                  <li>
                    <strong>Snoqualmie Falls:</strong> This is the easiest
                    option for those who want to see a stunning 268-foot
                    waterfall, without a strenuous hike. This waterfall is
                    wheelchair accessible (paved paths) and has viewing
                    platforms.{' '}
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
                    is about 4 miles round trip with elevation gain. We
                    recommend using the jet lag to your advantage and waking up
                    early to do this hike to beat the crowds.{' '}
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
                    <strong>Twin Falls:</strong> Just a 40-minute drive from
                    Redmond, this short and sweet 2-mile round-trip hike (about
                    1 hour and 20 minutes) rewards you with stunning views of
                    the beautiful Twin Falls. It's a perfect quick escape into
                    nature, especially if you're looking for something scenic
                    but not too strenuous!{' '}
                    <OpenInExternalLink
                      title="AllTrails"
                      url="https://www.alltrails.com/trail/us/washington/twin-falls-trail"
                    />
                  </li>
                  <li>
                    <strong>North Cascades National Park:</strong> If you're up
                    for a bit of an adventure, the breathtaking North Cascades
                    are just about a 2.5-hour drive away. It's well worth the
                    trip for stunning mountain views, alpine lakes, and
                    unforgettable hikes—perfect for a day trip or a peaceful
                    escape into nature!{' '}
                    <OpenInExternalLink
                      title="AllTrails"
                      url="https://www.alltrails.com/trail/us/washington/diablo-lake-overlook"
                    />
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
                    <strong>Mount Rainier National Park:</strong> A true a gem
                    of the Pacific Northwest. Towering glaciers,
                    wildflower-filled meadows, and dramatic alpine views make
                    every trail feel like a postcard come to life. Whether
                    you're taking a leisurely stroll through Paradise or
                    challenging yourself on the Skyline Trail, the scenery is
                    unforgettable. If you've never been, it's one of those
                    places that genuinely makes you stop and say, “Wow.” It is
                    another road trip option, about 2 hours from Redmond and you
                    should arrive as early as possible to avoid crowds.{' '}
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
                    caption="Mount Rainier on the trail"
                  />
                </ul>
              </AccordionItem>
              <AccordionItem
                id="Outdoor-attractions"
                title="Other Attractions"
                useSubHeading
                isOpen={!!openSections['Outdoor-attractions']}
                onToggle={() => toggleSection('Outdoor-attractions')}
              >
                <ul className="list-disc pl-6  text-md flex flex-col gap-2">
                  <li>
                    <strong>2026 FIFA World Cup:</strong> Seattle is hosting a
                    handful of matches for the 2026 FIFA World Cup. If you are a
                    soccer fan, consider checking out a match while you are in
                    town!
                  </li>
                  <li>
                    <strong>Leavenworth:</strong> Step into a storybook Bavarian
                    village nestled in the mountains, just two hours from
                    Seattle. With its alpine charm, scenic views, outdoor
                    adventures, and year-round festivities, Leavenworth is
                    perfect for a fun day trip or a cozy overnight escape.
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
                    feast for the senses! Wander through stalls filled with
                    fresh seafood, local produce, handmade goods, and street
                    performers. A perfect place to shop, snack, and soak up the
                    city's vibe.
                  </li>
                  <li>
                    <strong>Ballard Farmer's Market:</strong> A local favorite
                    every Sunday, this lively market is full of fresh produce,
                    artisan treats, and handcrafted goods. Located in the
                    charming Ballard neighborhood, it's a great spot to spend a
                    Sunday morning.
                  </li>
                  <li>
                    <strong>Golden Gates Park:</strong> Enjoy breathtaking views
                    of the Puget Sound, sandy beaches, and forested trails.
                    Whether you're into beach picnics or sunset strolls, this
                    hidden gem is a peaceful escape from the city buzz.
                  </li>
                </ul>
              </AccordionItem>
            </div>
          </AccordionItem>
        </div>
      </PageWrapper>
    </AppWithHeader>
  );
}
