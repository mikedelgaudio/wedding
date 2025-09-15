import { mailtoLink } from '../utils/mailToLink';

export function RsvpHeader() {
  return (
    <div className="flex flex-col gap-2">
      <p className="text-lg">
        We hope you'll be able to join us—it would mean so much to celebrate
        together! But we also understand that summer is a busy time and travel
        isn't always easy. If you're unable to attend, please know that your
        love and support still mean the world to us.
      </p>
      <p className="text-md m-0">
        Questions? Email us at{' '}
        <a
          className="underline focus:outline-none focus:ring hover:no-underline"
          href={mailtoLink}
        >
          wedding@delgaudio.dev
        </a>
        .
      </p>
    </div>
  );
}
