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
        {!rsvpSnapshot ? (
          <RsvpSignIn onSuccess={setRsvpSnapshot} />
        ) : (
          <RsvpForm snapshot={rsvpSnapshot} />
        )}
      </PageWrapper>
    </AppWithHeader>
  );
}
