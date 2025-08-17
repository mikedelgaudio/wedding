import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase/firebase.service';

// Page name mapping for cleaner analytics
const PAGE_NAMES: Record<string, string> = {
  '/': 'home',
  '/schedule': 'schedule',
  '/rsvp': 'rsvp',
  '/faq': 'frequently_asked_questions',
  '/travel': 'travel',
  '/logout': 'logout',
  '/login': 'login',
};

export const trackPageView = (path: string): void => {
  if (analytics) {
    const pageName = PAGE_NAMES[path] || path.replace(/[^a-zA-Z0-9]/g, '_');
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_path: path,
    });
  }
};

export const trackLoginFormSubmit = (): void => {
  if (analytics) {
    logEvent(analytics, 'login_form_submit_clicked');
  }
};

export const trackLoginSuccess = (): void => {
  if (analytics) {
    logEvent(analytics, 'login_success');
  }
};

export const trackLoginFailed = (code?: string, message?: string): void => {
  if (analytics) {
    logEvent(analytics, 'login_failed', {
      failure_code: code || 'unknown',
      failure_message: message || 'unknown',
    });
  }
};

// Track RSVP form events
export const trackRsvpFormLookupSubmit = (): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_lookup_submit_clicked');
  }
};

export const trackRsvpError = (
  errorType: string,
  firebaseCode?: string,
  firebaseMessage?: string,
): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_lookup_error', {
      error_type: errorType,
      failure_code: firebaseCode || 'unknown',
      failure_message: firebaseMessage || 'unknown',
    });
  }
};

// Update success tracking too
export const trackRsvpSuccess = (): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_lookup_success');
  }
};

export const trackRsvpFormLoaded = (): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_form_loaded');
  }
};

// Track RSVP form submission attempt
export const trackRsvpFormSubmit = (): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_form_submit_clicked');
  }
};

export const trackRsvpSaveError = (
  errorType: string,
  firebaseCode?: string,
  firebaseMessage?: string,
): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_form_save_error', {
      error_type: errorType,
      failure_code: firebaseCode || 'unknown',
      failure_message: firebaseMessage || 'unknown',
    });
  }
};

export const trackRsvpSaveSuccess = (): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_form_save_success');
  }
};

export const trackRsvpSaveSuccessNoOp = (): void => {
  if (analytics) {
    logEvent(analytics, 'rsvp_form_save_success_no_op');
  }
};
