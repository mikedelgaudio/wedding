import type { JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';

interface Place {
  name: string;
  category: 'food' | 'sightseeing' | 'cafe';
  description: string;
  imageUrl: string;
  altText: string;
}

const categorySymbols: Record<Place['category'], string> = {
  food: '🍽️',
  sightseeing: '🔭',
  cafe: '☕',
};

const places: Place[] = [
  {
    name: 'Pike Place Market',
    category: 'sightseeing',
    description:
      'An iconic Seattle experience with fresh produce, local vendors, and the famous fish throwers.',
    imageUrl: '/images/pike-place.jpg', // Replace with your own image
    altText: 'Pike Place Market with people and vendor stalls',
  },
  {
    name: 'Toulouse Petit Kitchen & Lounge',
    category: 'food',
    description:
      'A beloved spot offering rich Creole flavors and an award-winning brunch menu.',
    imageUrl: '/images/toulouse.jpg', // Replace with your own image
    altText: 'Plated food at Toulouse Petit restaurant',
  },
  {
    name: 'Storyville Coffee',
    category: 'cafe',
    description:
      'Charming coffee shop located above Pike Place Market with great views and ambiance.',
    imageUrl: '/images/storyville.jpg', // Replace with your own image
    altText: 'Cozy cafe interior with coffee cups and soft lighting',
  },
];

export function Travel(): JSX.Element {
  return (
    <AppWithHeader>
      <PageWrapper pageTitle="Travel">
        <section
          aria-labelledby="things-to-do-heading"
          className="max-w-5xl mx-auto"
        >
          <ul className="space-y-10">
            {places.map(place => (
              <li
                key={place.name}
                className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow-lg overflow-hidden md:space-x-6"
              >
                <div className="md:w-2/3 p-6">
                  <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <span aria-label={place.category} role="img">
                      {categorySymbols[place.category]}
                    </span>
                    {place.name}
                  </h3>
                  <p className="text-gray-700 mt-2 leading-relaxed">
                    {place.description}
                  </p>
                </div>
                <div className="md:w-1/3 w-full h-64">
                  <img
                    src={place.imageUrl}
                    alt={place.altText}
                    className="object-cover w-full h-full rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none"
                    loading="lazy"
                  />
                </div>
              </li>
            ))}
          </ul>
        </section>
      </PageWrapper>
    </AppWithHeader>
  );
}
