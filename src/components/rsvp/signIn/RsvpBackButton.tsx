export function RsvpBackButton({ onBack }: { onBack: () => void }) {
  return (
    <button
      type="button"
      onClick={onBack}
      className="m-0 text-sm text-black underline hover:no-underline cursor-pointer"
    >
      Other RSVP options
    </button>
  );
}
