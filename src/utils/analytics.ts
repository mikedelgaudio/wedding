import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebase.service';

/**
 * Tracks a custom event in Firebase Analytics.
 * @param eventName - The name of the custom event to track
 * @param eventParams - Optional parameters to include with the event
 */
export function trackEvent<T>(
  eventName: string,
  eventParams?: Record<string, T>,
): void {
  if (analytics) {
    logEvent(analytics, eventName, eventParams);
  }
}
