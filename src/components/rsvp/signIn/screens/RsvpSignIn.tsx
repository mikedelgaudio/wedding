import { type DocumentSnapshot } from 'firebase/firestore';
import { useCallback, useState } from 'react';
import type { IRSVPDoc } from '../../../../firebase/IRSVPDoc';
import { useEvent } from '../../../../hooks/useEvent';
import { RsvpCodeLookup } from './RsvpCodeLookup';
import { RsvpNameLookup } from './RsvpNameLookup';
import { SignInMethodSelection } from './SignInMethodSelection';

interface RsvpSignInProps {
  onSuccess: (snap: DocumentSnapshot<IRSVPDoc>) => void;
}

export function RsvpSignIn({ onSuccess }: RsvpSignInProps) {
  const policyData = useEvent();

  const [signInMode, setSignInMode] = useState<'code' | 'name' | null>(null);

  const setSignInModeMemoized = useCallback((mode: 'code' | 'name') => {
    setSignInMode(mode);
  }, []);

  const onBack = useCallback(() => {
    setSignInMode(null);
  }, []);

  const { rsvpPolicy } = policyData || {};

  // If policy data is not loaded yet, show loading
  if (!rsvpPolicy) {
    return (
      <div className="text-center py-8">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  const screen =
    rsvpPolicy === 'code' || signInMode === 'code' ? (
      <RsvpCodeLookup
        onSuccess={onSuccess}
        onBack={signInMode ? onBack : undefined}
      />
    ) : rsvpPolicy === 'name' || signInMode === 'name' ? (
      <RsvpNameLookup
        onSuccess={onSuccess}
        onBack={signInMode ? onBack : undefined}
      />
    ) : (
      <SignInMethodSelection onSelectMethod={setSignInModeMemoized} />
    );

  return screen;
}
