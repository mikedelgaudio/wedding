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

export const trackFormSubmit = (formName: string): void => {
  if (analytics) {
    logEvent(analytics, 'form_submit_clicked', {
      form_name: formName,
    });
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
      failure_reason: code || 'unknown_error',
      failure_message: message || 'An unknown error occurred',
    });
  }
};
