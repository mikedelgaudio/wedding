import { RsvpHeader } from './RsvpHeader';

interface RsvpMethodSelectorProps {
  onSelectMethod: (method: 'code' | 'name') => void;
}

export function RsvpMethodSelector({
  onSelectMethod,
}: RsvpMethodSelectorProps) {
  return (
    <>
      <RsvpHeader />
      <div className="space-y-4">
        <h2 className="text-xl font-semibold mb-4">Choose your RSVP method</h2>
        <button
          onClick={() => onSelectMethod('code')}
          className="cursor-pointer w-full p-4 text-left bg-white border-2 border-stone-300 rounded-lg hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">
                RSVP with invitation code
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Use the code found on your physical invitation (format:
                XXXX-XXXX)
              </p>
            </div>
            <div className="text-2xl">→</div>
          </div>
        </button>
        <button
          onClick={() => onSelectMethod('name')}
          className="cursor-pointer w-full p-4 text-left bg-white border-2 border-stone-300 rounded-lg hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-lg">RSVP by name lookup</h3>
              <p className="text-sm text-gray-600 mt-1">
                Find your invitation by searching for your name
              </p>
            </div>
            <div className="text-2xl">→</div>
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
