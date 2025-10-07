import type { DocumentSnapshot } from 'firebase/firestore';
import type { IRSVPDoc } from '../../../firebase/IRSVPDoc';

export interface IRsvpScreenProps {
  onSuccess: (snap: DocumentSnapshot<IRSVPDoc>) => void;
  onBackToMethodSelection?: () => void;
}
