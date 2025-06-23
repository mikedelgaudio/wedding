// src/components/RsvpForm.tsx
import type { QueryDocumentSnapshot } from 'firebase/firestore';
import type { IRSVPDoc } from '../../firebase/IRSVPDoc';

interface RsvpFormProps {
  snapshot: QueryDocumentSnapshot<IRSVPDoc>;
}

export function RsvpForm({ snapshot }: RsvpFormProps) {
  const data = snapshot.data();
  const deadline = data.rsvpDeadline.toDate().toLocaleString();

  return (
    <div className="w-full max-w-md p-6 rounded-lg shadow space-y-4">
      <h2 className="text-2xl font-semibold">Welcome, {data.invitee.name}</h2>
      <p className="text-gray-600">
        You can RSVP until <strong>{deadline}</strong>.
      </p>

      {/* 
        ← Your full RSVP form goes here.
        Use snapshot.id to update via updateDoc(doc(db,'rsvp', snapshot.id), {...})
      */}

      <p className="italic text-gray-500">
        (Render your RSVP fields—guests, dietary, attending toggles here…)
      </p>
    </div>
  );
}
