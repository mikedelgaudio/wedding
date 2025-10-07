import type { DocumentSnapshot } from 'firebase/firestore';
import { useCallback, useMemo, useState, type JSX } from 'react';
import { AppWithHeader } from '../AppWithHeader';
import { ErrorBoundary } from '../components/boundraies/ErrorBoundary';
import { PageWrapper } from '../components/PageWrapper';
import { RsvpForm } from '../components/rsvp/form/RsvpForm';
import { RsvpCodeLookup } from '../components/rsvp/loginLookup/code/RsvpCodeLookup';
import { RsvpMethodSelector } from '../components/rsvp/loginLookup/name/RsvpMethodSelector';
import {
  RsvpNameLookup,
  type NameMatch,
} from '../components/rsvp/loginLookup/name/RsvpNameLookup';
import { RsvpNameSelection } from '../components/rsvp/loginLookup/name/RsvpNameSelection';
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

  const allowRsvpByName = !!eventData?.allowRsvpByName;

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
    // Show the form directly if we already have a snapshot
    if (rsvpState.snapshot) {
      return <RsvpForm />;
    }

    // If allowRsvpByName is not enabled, show traditional code entry
    if (!allowRsvpByName) {
      return <RsvpCodeLookup onSuccess={handleRsvpSuccess} />;
    }

    // Handle different states for name-based RSVP
    switch (state) {
      case 'method-selection':
        return <RsvpMethodSelector onSelectMethod={handleMethodSelection} />;

      case 'code-entry':
        return (
          <RsvpCodeLookup
            onSuccess={handleRsvpSuccess}
            onBackToMethodSelection={handleBackToMethodSelection}
          />
        );

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
        return <RsvpCodeLookup onSuccess={handleRsvpSuccess} />;
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
      <ErrorBoundary>
        <RsvpContent />
      </ErrorBoundary>
    </RsvpProvider>
  );
}
