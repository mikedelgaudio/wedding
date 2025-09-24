import type { DocumentSnapshot } from 'firebase/firestore';
import { useCallback, useMemo, useState, type JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { PageWrapper } from '../components/PageWrapper';
import {
  RsvpNameLookup,
  type NameMatch,
} from '../components/rsvp/forms/RsvpNameLookup';
import { RsvpSignIn } from '../components/rsvp/forms/RsvpSignIn';
import { RsvpErrorBoundary } from '../components/rsvp/RsvpErrorBoundary';
import { RsvpForm } from '../components/rsvp/RsvpForm';
import { RsvpMethodSelector } from '../components/rsvp/RsvpMethodSelector';
import { RsvpNameSelection } from '../components/rsvp/RsvpNameSelection';
import { RsvpProvider } from '../context/rsvp/RsvpProvider';
import type { IRSVPDoc } from '../firebase/IRSVPDoc';
import { useEvent } from '../hooks/useEvent';
import { useRsvp } from '../hooks/useRsvp';

type RsvpState =
  | 'method-selection'
  | 'code-entry'
  | 'name-entry'
  | 'name-selection'
  | 'rsvp-form';

function RsvpContent(): JSX.Element {
  const eventData = useEvent();
  const { state: rsvpState, actions } = useRsvp();
  const [state, setState] = useState<RsvpState>(
    rsvpState.snapshot ? 'rsvp-form' : 'method-selection',
  );
  const [nameMatches, setNameMatches] = useState<NameMatch[]>([]);

  // Memoize the method selection flag to avoid recalculation
  const allowRsvpByName = useMemo(
    () => eventData?.allowRsvpByName === true,
    [eventData?.allowRsvpByName],
  );

  // Memoize all callback handlers to prevent unnecessary re-renders
  const handleMethodSelection = useCallback((method: 'code' | 'name') => {
    setState(method === 'code' ? 'code-entry' : 'name-entry');
  }, []);

  const handleBackToMethodSelection = useCallback(() => {
    setState('method-selection');
  }, []);

  const handleBackToNameEntry = useCallback(() => {
    setState('name-entry');
    setNameMatches([]);
  }, []);

  const handleNamesFound = useCallback((matches: NameMatch[]) => {
    setNameMatches(matches);
    setState('name-selection');
  }, []);

  const handleRsvpSuccess = useCallback(
    (snapshot: DocumentSnapshot<IRSVPDoc>) => {
      actions.setSnapshot(snapshot);
      setState('rsvp-form');
    },
    [actions],
  );

  // Memoize the content rendering to avoid unnecessary recalculations
  const content = useMemo(() => {
    // If RSVP is completed, show the form
    if (rsvpState.snapshot) {
      return <RsvpForm />;
    }

    // If allowRsvpByName is not enabled, show traditional code entry
    if (!allowRsvpByName) {
      return <RsvpSignIn onSuccess={handleRsvpSuccess} />;
    }

    // Handle different states for name-based RSVP
    switch (state) {
      case 'method-selection':
        return <RsvpMethodSelector onSelectMethod={handleMethodSelection} />;

      case 'code-entry':
        return <RsvpSignIn onSuccess={handleRsvpSuccess} />;

      case 'name-entry':
        return (
          <RsvpNameLookup
            onSuccess={handleRsvpSuccess}
            onNamesFound={handleNamesFound}
            onBackToMethodSelection={handleBackToMethodSelection}
          />
        );

      case 'name-selection':
        return (
          <RsvpNameSelection
            matches={nameMatches}
            onSelectRsvp={handleRsvpSuccess}
            onBackToNameEntry={handleBackToNameEntry}
          />
        );

      default:
        return <RsvpMethodSelector onSelectMethod={handleMethodSelection} />;
    }
  }, [
    rsvpState.snapshot,
    allowRsvpByName,
    state,
    nameMatches,
    handleMethodSelection,
    handleRsvpSuccess,
    handleNamesFound,
    handleBackToMethodSelection,
    handleBackToNameEntry,
  ]);

  return (
    <AppWithHeader>
      <PageWrapper pageTitle="RSVP">{content}</PageWrapper>
    </AppWithHeader>
  );
}

export function Rsvp(): JSX.Element {
  return (
    <RsvpProvider>
      <RsvpErrorBoundary>
        <RsvpContent />
      </RsvpErrorBoundary>
    </RsvpProvider>
  );
}
