import type { DocumentSnapshot } from 'firebase/firestore';
import { useState, type JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import { RsvpForm } from '../components/rsvp/RsvpForm';
import { RsvpSignIn } from '../components/rsvp/RsvpSignIn';
import type { IRSVPDoc } from '../firebase/IRSVPDoc';

export function Rsvp(): JSX.Element {
  const [rsvpSnapshot, setRsvpSnapshot] =
    useState<DocumentSnapshot<IRSVPDoc> | null>(null);

  return (
    <AppWithHeader>
      <PageWrapper pageTitle="RSVP">
        <p>
          We know Summer is a busy time for many of you, and we understand that
          traveling from out of state can be challenging. Please know that we
          completely understand if you’re unable to attend, and your love and
          support mean the world to us regardless!
        </p>
        {!rsvpSnapshot ? (
          <RsvpSignIn onSuccess={setRsvpSnapshot} />
        ) : (
          <RsvpForm snapshot={rsvpSnapshot} />
        )}
      </PageWrapper>
    </AppWithHeader>
  );
}
