/** Cookie helps SSR skip the splash plate on refresh (same tab already played). */
export const SPLASH_COOKIE = 'vaw_splash_s';
/** Old year-long cookie — cleared so it cannot suppress splash forever. */
export const SPLASH_COOKIE_LEGACY = 'vaw_splash';
/**
 * Source of truth on the client: survives refresh, clears when the tab/window closes.
 * Cookie alone was skipping the first enter (stale session) while a refresh could
 * still paint splash-pending — the opposite of what we want.
 */
export const SPLASH_SESSION_KEY = 'vaw_splash_played';

/** Session cookie: pairs with sessionStorage so SSR can skip the plate on refresh. */
export function splashCookieHeader() {
  return `${SPLASH_COOKIE}=1; Path=/; SameSite=Lax`;
}

/** Clear so the next paint can show the splash again (e.g. /splash). */
export function clearSplashCookieHeader() {
  return `${SPLASH_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax`;
}

export function clearLegacySplashCookieHeader() {
  return `${SPLASH_COOKIE_LEGACY}=; Path=/; Max-Age=0; SameSite=Lax`;
}

function dropLegacyCookie() {
  if (typeof document === 'undefined') return;
  if (document.cookie.split('; ').some((c) => c.startsWith(`${SPLASH_COOKIE_LEGACY}=`))) {
    document.cookie = clearLegacySplashCookieHeader();
  }
}

/** True only when this tab already finished the splash (refresh). Not cookie alone. */
export function hasSeenSplash() {
  if (typeof window === 'undefined') return false;
  dropLegacyCookie();
  try {
    return sessionStorage.getItem(SPLASH_SESSION_KEY) === '1';
  } catch {
    // Private mode / blocked storage — fall back to the session cookie.
    return document.cookie.split('; ').includes(`${SPLASH_COOKIE}=1`);
  }
}

/** Remember this tab so a refresh does not replay the splash. */
export function markSplashSeen() {
  if (typeof document === 'undefined') return;
  try {
    sessionStorage.setItem(SPLASH_SESSION_KEY, '1');
  } catch {
    /* ignore */
  }
  document.cookie = splashCookieHeader();
  dropLegacyCookie();
}

/** /splash replay — allow the plate to run again in this tab. */
export function clearSplashSeen() {
  if (typeof document === 'undefined') return;
  try {
    sessionStorage.removeItem(SPLASH_SESSION_KEY);
  } catch {
    /* ignore */
  }
  document.cookie = clearSplashCookieHeader();
  dropLegacyCookie();
}

/**
 * Inline boot script (layout): before React, align html class with sessionStorage
 * so a stale cookie cannot hide the splash on first enter, and a refresh does not
 * flash the plate.
 */
export const SPLASH_BOOT_SCRIPT = `(function(){try{var r=document.documentElement;var played=false;try{played=sessionStorage.getItem("${SPLASH_SESSION_KEY}")==="1"}catch(e){}if(played){r.classList.remove("splash-pending","splash-exiting","splash-react-ready","splash-locked","splash-forced");r.classList.add("splash-complete")}else{r.classList.remove("splash-complete");r.classList.add("splash-pending");r.style.backgroundColor="#f5f3ee";if(document.body)document.body.style.backgroundColor="#f5f3ee"}setTimeout(function(){if(r.classList.contains("splash-pending")||r.classList.contains("splash-exiting")){r.classList.remove("splash-pending","splash-exiting","splash-react-ready","splash-locked","splash-forced");r.classList.add("splash-complete");r.style.backgroundColor="";if(document.body){document.body.style.overflow="";document.body.style.backgroundColor=""}}},9000)}catch(e){}})();`;
