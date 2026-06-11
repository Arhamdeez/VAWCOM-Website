/** Runs before first paint — avoids homepage flash before splash. */
export const SPLASH_BOOT_SCRIPT = `(function(){try{var s=sessionStorage.getItem('hasSeenSplash')==='true';var r=document.documentElement;r.classList.toggle('splash-complete',s);r.classList.toggle('splash-pending',!s);}catch(e){document.documentElement.classList.add('splash-complete');}})();`;
