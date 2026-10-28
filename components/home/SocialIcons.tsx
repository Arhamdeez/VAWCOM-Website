export function IconLinkedIn({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <rect x="2.5" y="2.5" width="19" height="19" rx="3" stroke="currentColor" strokeWidth="1.6" />
      <rect x="6.6" y="10" width="2.1" height="7.6" fill="currentColor" />
      <circle cx="7.65" cy="7.1" r="1.25" fill="currentColor" />
      <path
        d="M11.4 17.6V10h2.1v1.1c.5-.8 1.4-1.3 2.5-1.3 1.8 0 2.9 1.2 2.9 3.2v4.6h-2.1v-4.2c0-1.1-.5-1.7-1.5-1.7s-1.7.7-1.7 1.8v4.1h-2.2z"
        fill="currentColor"
      />
    </svg>
  );
}

export function IconInstagram({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <rect x="2.8" y="2.8" width="18.4" height="18.4" rx="5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="12" cy="12" r="4.1" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="17.2" cy="6.8" r="1.15" fill="currentColor" />
    </svg>
  );
}

export function IconGitHub({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden>
      <path
        fill="currentColor"
        d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.211-3.06.663-3.706-1.309-3.706-1.309-.5-1.266-1.221-1.606-1.221-1.606-.999-.681.077-.668.077-.668 1.105.077 1.687 1.135 1.687 1.135.981 1.682 2.575 1.196 3.202.914.096-.715.384-1.196.699-1.471-2.442-.275-5.01-1.221-5.01-5.436 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.017 1.128a10.193 10.193 0 0 1 2.75-.371c.936.004 1.871.127 2.75.371 2.096-1.43 3.016-1.128 3.016-1.128.607 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.228-2.575 5.148-5.027 5.423.395.34.743 1.005.743 2.029 0 1.471-.014 2.654-.014 3.017 0 .289.206.631.763.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"
      />
    </svg>
  );
}

export function IconMail({ size = 17 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" aria-hidden>
      <rect x="2.8" y="5" width="18.4" height="14" rx="2.2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M4 7.2 12 13l8-5.8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}
