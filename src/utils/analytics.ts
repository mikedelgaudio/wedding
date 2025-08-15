// src/utils/analytics.ts
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

// 1. Track page visits (engagement/hits)
export const trackPageView = (path: string): void => {
  if (analytics) {
    const pageName = PAGE_NAMES[path] || path.replace(/[^a-zA-Z0-9]/g, '_');
    logEvent(analytics, 'page_view', {
      page_name: pageName,
      page_path: path,
    });
  }
};

// 3. Track form submit button clicks
export const trackFormSubmit = (formName: string): void => {
  if (analytics) {
    logEvent(analytics, 'form_submit_clicked', {
      form_name: formName,
    });
  }
};

// 4. Track form submission errors
export const trackFormError = (
  formName: string,
  errorMessage: string,
  errorType?: string,
): void => {
  if (analytics) {
    logEvent(analytics, 'form_error', {
      form_name: formName,
      error_message: errorMessage,
      error_type: errorType || 'validation_error',
    });
  }
};

// 5. Track server errors from forms
export const trackServerError = (
  formName: string,
  statusCode: number,
  errorMessage: string,
): void => {
  if (analytics) {
    logEvent(analytics, 'server_error', {
      form_name: formName,
      status_code: statusCode,
      error_message: errorMessage,
    });
  }
};

// 6. Track successful login
export const trackLoginSuccess = (): void => {
  if (analytics) {
    logEvent(analytics, 'login_success');
  }
};

// 7. Track failed login
export const trackLoginFailed = (reason: string): void => {
  if (analytics) {
    logEvent(analytics, 'login_failed', {
      failure_reason: reason,
    });
  }
};
