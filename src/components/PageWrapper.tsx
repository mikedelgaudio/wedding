import type { JSX } from 'react';

export function PageWrapper({
  pageTitle,
  children,
}: {
  pageTitle?: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="w-full md:max-w-[80ch] mx-auto px-6 pt-4 md:p-4 ">
      {pageTitle && (
        <h1 className="text-2xl md:text-6xl font-bold mb-2 text-gray-800">
          {pageTitle}
        </h1>
      )}
      <div className="space-y-4 pb-8">{children}</div>
    </div>
  );
}
