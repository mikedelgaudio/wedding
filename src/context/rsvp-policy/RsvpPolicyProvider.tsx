import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { db } from '../../firebase/firebase.service';
import type { IRsvpPolicyData } from './IRsvpPolicyData';
import { RsvpPolicyContext } from './RsvpPolicyContext';

export function RsvpPolicyProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [policyData, setPolicyData] = useState<IRsvpPolicyData | null>(null);

  useEffect(() => {
    async function fetchRsvpPolicyOnce() {
      try {
        const rsvpPolicyRef = doc(db, 'rsvp', 'policy');
        const policyDoc = await getDoc(rsvpPolicyRef);
        if (policyDoc.exists()) {
          const data = policyDoc.data();
          setPolicyData({
            allowNameLookup: data.allowNameLookup || false,
          });
        } else {
          // Default to code-only if no policy document exists
          setPolicyData({
            allowNameLookup: true,
          });
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Failed to fetch RSVP policy data:', error);
        // Default to code-only on error
        setPolicyData({
          allowNameLookup: false,
        });
      }
    }

    fetchRsvpPolicyOnce();
  }, []);

  return (
    <RsvpPolicyContext.Provider value={policyData}>
      {children}
    </RsvpPolicyContext.Provider>
  );
}
