import type { JSX } from 'react';

interface GoogleMapsLinkProps {
  address: string;
}

function GoogleMapsLink({ address }: GoogleMapsLinkProps): JSX.Element {
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address,
  )}`;

  return (
    <a
      href={googleMapsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:no-underline"
    >
      Open in Google Maps
    </a>
  );
}

export default GoogleMapsLink;
