import { useMemo, type JSX } from 'react';

interface OpenInExternalLinkProps {
  title: string;
  url?: string;
  googleMaps?: {
    address: string;
  };
}

export function OpenInExternalLink({
  title,
  url,
  googleMaps,
}: OpenInExternalLinkProps): JSX.Element {
  const { address } = googleMaps ?? {};

  const googleMapsUrl = useMemo(
    () =>
      address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            address,
          )}`
        : undefined,
    [address],
  );

  return (
    <a
      href={googleMapsUrl ?? url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-black underline hover:no-underline"
    >
      {title}
    </a>
  );
}
