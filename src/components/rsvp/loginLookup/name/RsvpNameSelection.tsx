import type { DocumentSnapshot } from 'firebase/firestore';
import type { IRSVPDoc } from '../../../../firebase/IRSVPDoc';
import { trackRsvpSuccess } from '../../../../utils/analytics';
import type { NameMatch } from './RsvpNameLookup';

interface RsvpNameSelectionProps {
  matches: NameMatch[];
  onSelectRsvp: (snapshot: DocumentSnapshot<IRSVPDoc>) => void;
  onBackToNameEntry: () => void;
}

export function RsvpNameSelection({
  matches,
  onSelectRsvp,
  onBackToNameEntry,
}: RsvpNameSelectionProps) {
  const handleSelectRsvp = (snapshot: DocumentSnapshot<IRSVPDoc>) => {
    trackRsvpSuccess();
    onSelectRsvp(snapshot);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-2">
          Found {matches.length} possible match
          {matches.length > 1 ? 'es' : ''}
        </h2>
        <p className="text-lg">
          Please select your name if it is in the list below or{' '}
          <span
            role="button"
            onClick={onBackToNameEntry}
            className="cursor-pointer underline hover:no-underline"
          >
            try again
          </span>
        </p>
      </div>

      <div className="space-y-3">
        {matches.map((match, index) => {
          return (
            <button
              key={`${match.snapshot.id}-${index}`}
              onClick={() => handleSelectRsvp(match.snapshot)}
              className="cursor-pointer w-full p-4 text-left bg-white border-2 border-stone-300 rounded-lg hover:border-stone-500 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:border-stone-900 transition-colors"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold text-lg">{match.displayName}</h3>
                </div>
                <div className="text-2xl">→</div>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-6 p-4 bg-fantasy-200 rounded-lg">
        <p className="text-sm ">
          <strong>Don't see your name?</strong> You can try:
        </p>
        <ul className="text-sm  mt-2 space-y-1 ml-4 list-disc">
          <li>
            Checking the spelling of your name and{' '}
            <span
              role="button"
              onClick={onBackToNameEntry}
              className="cursor-pointer underline hover:no-underline"
            >
              trying again
            </span>
          </li>
          <li>
            <span
              role="button"
              onClick={() => window.location.reload()}
              className="cursor-pointer underline hover:no-underline"
            >
              Using your RSVP code instead
            </span>
          </li>
          <li>
            Emailing us at{' '}
            <a
              className="underline focus:outline-none focus:ring hover:no-underline"
              href="mailto:wedding@delgaudio.dev"
            >
              wedding@delgaudio.dev
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
