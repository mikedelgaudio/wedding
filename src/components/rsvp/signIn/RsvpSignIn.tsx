import { type DocumentSnapshot } from 'firebase/firestore';
import { useState } from 'react';
import type { RsvpPolicyType } from '../../../context/event/IEventData';
import type { IRSVPDoc } from '../../../firebase/IRSVPDoc';
import { useEvent } from '../../../hooks/useEvent';
import { RsvpNameLookup } from './RsvpNameLookup';
import { SignInMethodSelection } from './SignInMethodSelection';

interface RsvpSignInProps {
  onSuccess: (snap: DocumentSnapshot<IRSVPDoc>) => void;
}

export function RsvpSignIn({ onSuccess }: RsvpSignInProps) {
  const policyData = useEvent();
  const [signInMode, setSignInMode] = useState<RsvpPolicyType>(() => {
    // Initialize mode based on policy if available
    return 'code';
  });

  // If policy data is not loaded yet, show loading
  if (!policyData) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  // If name lookup is not allowed, go directly to code mode
  const shouldShowSelection = policyData.rsvpPolicy === 'both';

  return (
    <>
      {!shouldShowSelection || signInMode === 'code' ? (
        <RsvpSignIn onSuccess={onSuccess} />
      ) : signInMode === 'name' ? (
        <RsvpNameLookup
          onSuccess={onSuccess}
          onBack={() => setSignInMode('both')}
        />
      ) : (
        <SignInMethodSelection
          onSelectCode={() => setSignInMode('code')}
          onSelectName={() => setSignInMode('name')}
        />
      )}
    </>
  );
}
