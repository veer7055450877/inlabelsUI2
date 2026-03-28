/**
 * POST /save-email
 * Called on page load with the email from the URL query param.
 */
export async function saveEmail(payload) {
  try {
    await fetch('/save-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[saveEmail] failed silently:', err);
  }
}

/**
 * POST /update-feedback
 * Called on form submit — updates the same row in Google Sheet by email.
 */
export async function updateFeedback(payload) {
  try {
    const res = await fetch('/update-feedback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    return res.ok;
  } catch (err) {
    console.warn('[updateFeedback] failed silently:', err);
    return false;
  }
}

/**
 * Collect analytics metadata for every request.
 */
export function buildAnalytics({ email, variant, extensionVersion }) {
  return {
    email,
    variant,
    extensionVersion: extensionVersion || 'unknown',
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString(),
    screenWidth: window.screen.width,
    language: navigator.language,
  };
}
