import type { JSX } from 'react';

interface OpenInExternalLinkProps {
  title: string;
  url: string;
}

export function OpenInExternalLink({
  title,
  url,
}: OpenInExternalLinkProps): JSX.Element {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="text-blue-600 underline hover:no-underline"
    >
      {title}
    </a>
  );
}
