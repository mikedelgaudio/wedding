import { RsvpHeader } from '../RsvpHeader';

interface SignInMethodSelectionProps {
  onSelectMethod: (method: 'code' | 'name') => void;
}

export function SignInMethodSelection({
  onSelectMethod,
}: SignInMethodSelectionProps) {
  return (
    <>
      <RsvpHeader />
      <h2 className="text-xl font-semibold mb-4">Choose your RSVP method</h2>
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => onSelectMethod('code')}
          className="w-full focus:outline-none focus-visible:ring ring-black ring-offset-2 cursor-pointer bg-stone-900 text-white py-3 px-4 rounded hover:bg-stone-700 focus-visible:bg-stone-700 text-left"
        >
          <div className="font-semibold mb-1">RSVP with Code</div>
          <div className="text-sm opacity-90">
            Use the code from your invitation (XXXX-XXXX)
          </div>
        </button>

        <button
          type="button"
          onClick={() => onSelectMethod('name')}
          className="w-full focus:outline-none focus-visible:ring ring-black ring-offset-2 cursor-pointer bg-stone-900 text-white py-3 px-4 rounded hover:bg-stone-700  focus-visible:bg-stone-700 text-left"
        >
          <div className="font-semibold mb-1">RSVP with Name</div>
          <div className="text-sm opacity-90">
            Search for your invitation by name
          </div>
        </button>
      </div>
    </>
  );
}
