interface SignInMethodSelectionProps {
  onSelectCode: () => void;
  onSelectName: () => void;
}

export function SignInMethodSelection({
  onSelectCode,
  onSelectName,
}: SignInMethodSelectionProps) {
  return (
    <>
      <h2 className="text-xl font-semibold mb-4">
        How would you like to RSVP?
      </h2>

      <div className="space-y-4">
        <button
          type="button"
          onClick={onSelectCode}
          className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-900 text-white py-3 px-4 rounded hover:bg-stone-700 text-left"
        >
          <div className="font-semibold mb-1">RSVP with Code</div>
          <div className="text-sm opacity-90">
            Use the code from your invitation (XXXX-XXXX)
          </div>
        </button>

        <button
          type="button"
          onClick={onSelectName}
          className="w-full focus:outline-none focus:ring cursor-pointer bg-stone-600 text-white py-3 px-4 rounded hover:bg-stone-500 text-left"
        >
          <div className="font-semibold mb-1">RSVP with Name</div>
          <div className="text-sm opacity-90">
            Search for your invitation by name
          </div>
        </button>
      </div>

      <p className="text-sm mt-6">
        Questions? Email us at{' '}
        <a
          className="underline focus:outline-none focus:ring hover:no-underline"
          href="mailto:wedding@delgaudio.dev"
        >
          wedding@delgaudio.dev
        </a>
        .
      </p>
    </>
  );
}
