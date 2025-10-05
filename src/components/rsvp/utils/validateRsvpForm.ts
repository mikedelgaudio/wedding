import type { IGuest } from '../../../firebase/IRSVPDoc';
import type { FoodOptionId } from './foodOptions';

interface ValidationParams {
  attendingCeremony: boolean | null;
  attendingReception: boolean | null;
  attendingBrunch: boolean | null;
  foodOption: FoodOptionId | null;
  contactInfo: string;
  guestResponses: IGuest[];
  inviteeAllowedToAttendBrunch: boolean;
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function validateRsvpForm({
  attendingCeremony,
  attendingReception,
  attendingBrunch,
  foodOption,
  contactInfo,
  guestResponses,
  inviteeAllowedToAttendBrunch,
}: ValidationParams): string | undefined {
  if (attendingCeremony == null) {
    return 'Please select Yes or No for ceremony attendance.';
  }
  if (attendingReception == null) {
    return 'Please select Yes or No for reception attendance.';
  }
  if (attendingReception === true && !foodOption) {
    return 'Please select a food option for the reception dinner.';
  }

  // Always require contact info for invitee (they're the party leader)
  if (!contactInfo.trim()) {
    return 'Please provide your email address.';
  }
  if (!isValidEmail(contactInfo.trim())) {
    return 'Please provide a valid email address.';
  }
  if (
    attendingReception === true &&
    foodOption === 'unknown' &&
    !contactInfo.trim()
  ) {
    return 'Please provide your email address so we can contact you about food options.';
  }
  if (inviteeAllowedToAttendBrunch && attendingBrunch == null) {
    return 'Please select Yes or No for brunch attendance.';
  }

  // Only validate guests if there are any
  if (guestResponses.length > 0) {
    for (let i = 0; i < guestResponses.length; i++) {
      const g = guestResponses[i];
      if (!g) continue; // Safety check

      if (g.attendingCeremony == null) {
        return `Please select Yes or No for Guest ${
          i + 1
        } ceremony attendance.`;
      }
      if (g.attendingReception == null) {
        return `Please select Yes or No for Guest ${
          i + 1
        } reception attendance.`;
      }
      if (g.attendingReception === true && !g.foodOption) {
        return `Please select a food option for Guest ${
          i + 1
        } reception dinner.`;
      }

      // Only require contact info for guests when they select 'unknown' food option
      if (
        g.attendingReception === true &&
        g.foodOption === 'unknown' &&
        !g.contactInfo?.trim()
      ) {
        return `Please provide contact info for Guest ${
          i + 1
        } so we can discuss food options.`;
      }
      // If contact info is provided, validate it's a valid email
      if (g.contactInfo?.trim() && !isValidEmail(g.contactInfo.trim())) {
        return `Please provide a valid email address for Guest ${i + 1}.`;
      }
      if (g.allowedToAttendBrunch && g.attendingBrunch == null) {
        return `Please select Yes or No for Guest ${i + 1} brunch attendance.`;
      }
      if (
        (g.attendingCeremony || g.attendingReception || g.attendingBrunch) &&
        g.isNameEditable &&
        !g.name?.trim()
      ) {
        return `Please enter a name for Guest ${i + 1}.`;
      }
    }
  }
}
