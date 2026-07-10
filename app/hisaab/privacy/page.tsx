import type { Metadata } from 'next';
import Link from 'next/link';
import { SiteContainer } from '@/components/SiteContainer';

export const metadata: Metadata = {
  title: 'HISAAB Privacy Policy | Vawcom',
  description:
    'HISAAB keeps your spending data on your device. No backend server, no sale of transaction history, and SMS or notification access only for payment alerts.',
  robots: {
    index: false,
    follow: false,
  },
};

const LAST_UPDATED = 'July 11, 2026';

export default function HisaabPrivacyPolicyPage() {
  return (
    <article className="pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-[max(2rem,env(safe-area-inset-top,0px))]">
      <SiteContainer>
        <div className="mx-auto w-full max-w-3xl text-left">
          <header className="mb-8 border-b border-white/[0.08] pb-8">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/90">HISAAB</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">Privacy Policy</h1>
            <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
            <p className="mt-4 text-sm leading-relaxed text-slate-400">
              Developer: Arham, operating via{' '}
              <Link href="https://vawcom.com" className="text-emerald-400/90 underline-offset-2 hover:underline">
                Vawcom
              </Link>{' '}
              · Contact:{' '}
              <a href="mailto:arham@vawcom.com" className="text-emerald-400/90 underline-offset-2 hover:underline">
                arham@vawcom.com
              </a>
            </p>
          </header>

          <section
            aria-labelledby="privacy-summary"
            className="mb-10 rounded-xl border border-emerald-500/25 bg-emerald-500/[0.07] px-5 py-5 sm:px-6"
          >
            <h2 id="privacy-summary" className="text-lg font-semibold text-white">
              2. Summary
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              <li>
                <strong className="font-medium text-white">Your spending data stays on your phone.</strong>
              </li>
              <li>HISAAB has no backend server and does not upload your transaction history.</li>
              <li>SMS and notification access are used only to detect payment and transaction alerts.</li>
              <li>Data is not sold, not used for ads, and not shared with third parties for marketing.</li>
            </ul>
          </section>

          <div className="space-y-10 text-sm leading-relaxed text-slate-400 sm:text-[15px]">
            <section aria-labelledby="section-introduction">
              <h2 id="section-introduction" className="text-xl font-semibold text-white">
                1. Introduction
              </h2>
              <p className="mt-3">
                <strong className="text-slate-200">HISAAB</strong> is a personal finance and expense tracking Android app
                developed by <strong className="text-slate-200">Arham</strong>, operating via{' '}
                <Link href="https://vawcom.com" className="text-emerald-400/90 underline-offset-2 hover:underline">
                  Vawcom
                </Link>
                . It is not a bank, payment processor, lender, or investment service. It helps users track spending by
                automatically parsing payment alerts.
              </p>
              <p className="mt-3">
                This policy explains what data HISAAB accesses, how it is used, and what control you have. Questions
                can be sent to{' '}
                <a href="mailto:arham@vawcom.com" className="text-emerald-400/90 underline-offset-2 hover:underline">
                  arham@vawcom.com
                </a>
                .
              </p>
            </section>

            <section aria-labelledby="section-local-data">
              <h2 id="section-local-data" className="text-xl font-semibold text-white">
                3. Data stored locally on your device
              </h2>
              <p className="mt-3">
                HISAAB stores information in a local SQLite database on your device. This may include:
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Parsed transactions (amount, merchant or payee, category, date)</li>
                <li>Optional raw alert text so you can review parsing in the app</li>
                <li>App preferences (for example budget settings and account holder name for self-transfer detection)</li>
                <li>Gmail message IDs already processed, to avoid duplicate imports</li>
              </ul>
            </section>

            <section aria-labelledby="section-sms">
              <h2 id="section-sms" className="text-xl font-semibold text-white">
                4. SMS access (Android)
              </h2>
              <p className="mt-3">
                <strong className="text-slate-200">Permissions:</strong> <code className="text-slate-300">READ_SMS</code>,{' '}
                <code className="text-slate-300">RECEIVE_SMS</code>
              </p>
              <p className="mt-3">
                <strong className="text-slate-200">Declared Play use case:</strong> SMS-based money management
              </p>
              <p className="mt-3">
                HISAAB reads SMS only to import payment transaction alerts from banks and mobile wallets (for example
                Easypaisa, JazzCash, Raast, UBL, and similar short-code senders).
              </p>
              <p className="mt-4 font-medium text-slate-200">What is read</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>SMS from known wallet or bank short codes</li>
                <li>Messages that look like transaction alerts</li>
              </ul>
              <p className="mt-4 font-medium text-slate-200">What is not read or used</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Personal chat messages</li>
                <li>OTP or verification codes (ignored by parsing logic)</li>
                <li>Marketing texts</li>
              </ul>
              <p className="mt-3">
                HISAAB is not your default SMS app and does not send SMS. SMS content is never uploaded to any server and
                is never used for advertising, analytics resale, or unrelated features. You can revoke SMS access anytime
                in Android Settings.
              </p>
            </section>

            <section aria-labelledby="section-notifications">
              <h2 id="section-notifications" className="text-xl font-semibold text-white">
                5. Notification access (Android)
              </h2>
              <p className="mt-3">
                HISAAB can use Android Notification Access (user-enabled in system Settings) to read payment
                notifications from banking and wallet apps (for example JazzCash, NayaPay, UBL, and Google Wallet) for
                automatic expense logging.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Only used for payment-related notifications</li>
                <li>Processed on-device</li>
                <li>Not uploaded to Vawcom or any HISAAB server</li>
                <li>You enable and can revoke this in Android Settings → Notification access</li>
              </ul>
            </section>

            <section aria-labelledby="section-gmail">
              <h2 id="section-gmail" className="text-xl font-semibold text-white">
                6. Optional Gmail connection
              </h2>
              <p className="mt-3">You may optionally connect your Google account to import payment emails.</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Uses Google Sign-In and the Gmail API</li>
                <li>Reads payment-related emails from your mailbox</li>
                <li>Does not upload email content to HISAAB or Vawcom servers</li>
                <li>You can disconnect Gmail from within the app</li>
                <li>Only activated when you explicitly opt in</li>
              </ul>
            </section>

            <section aria-labelledby="section-never-uploaded">
              <h2 id="section-never-uploaded" className="text-xl font-semibold text-white">
                7. What is never uploaded
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>SMS or notification content</li>
                <li>Full transaction history to a developer-operated cloud</li>
                <li>Contacts or personal chats</li>
              </ul>
            </section>

            <section aria-labelledby="section-network">
              <h2 id="section-network" className="text-xl font-semibold text-white">
                8. Network use and third parties
              </h2>
              <p className="mt-3">HISAAB has no developer backend. Limited network use includes:</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  <strong className="text-slate-200">Gmail API</strong> — optional and user-initiated; reads payment
                  emails
                </li>
                <li>
                  <strong className="text-slate-200">Google Fonts</strong> — may download font files; no personal data
                  sent
                </li>
              </ul>
              <p className="mt-4 font-medium text-slate-200">Not used</p>
              <ul className="mt-2 list-disc space-y-2 pl-5">
                <li>Firebase, Sentry, or other analytics or crash SDKs that phone home spending data</li>
                <li>Advertising SDKs</li>
                <li>Cloud sync of spending history</li>
              </ul>
            </section>

            <section aria-labelledby="section-backup">
              <h2 id="section-backup" className="text-xl font-semibold text-white">
                9. Backup, export, and deletion
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>
                  Android auto-backup is disabled for app data — spending data is not backed up to Google Drive by
                  default through the app
                </li>
                <li>You may export a backup file when you explicitly choose to share or export from Settings</li>
                <li>You can delete data by clearing app data, uninstalling, or revoking permissions</li>
                <li>Release builds avoid logging sensitive SMS or notification bodies</li>
              </ul>
            </section>

            <section aria-labelledby="section-security">
              <h2 id="section-security" className="text-xl font-semibold text-white">
                10. Security
              </h2>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Processing is primarily on-device</li>
                <li>Gmail API traffic uses HTTPS</li>
                <li>Cleartext HTTP is blocked in release builds</li>
              </ul>
            </section>

            <section aria-labelledby="section-children">
              <h2 id="section-children" className="text-xl font-semibold text-white">
                11. Children&apos;s privacy
              </h2>
              <p className="mt-3">
                HISAAB is not directed at children under 13 (or under 16 where applicable). We do not knowingly collect
                children&apos;s data.
              </p>
            </section>

            <section aria-labelledby="section-changes">
              <h2 id="section-changes" className="text-xl font-semibold text-white">
                12. Changes to this policy
              </h2>
              <p className="mt-3">
                We may update this page. The &ldquo;Last updated&rdquo; date will change when we do. Continued use of
                HISAAB after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section aria-labelledby="section-contact">
              <h2 id="section-contact" className="text-xl font-semibold text-white">
                13. Contact
              </h2>
              <p className="mt-3">
                Questions about privacy:{' '}
                <a href="mailto:arham@vawcom.com" className="text-emerald-400/90 underline-offset-2 hover:underline">
                  arham@vawcom.com
                </a>
              </p>
            </section>
          </div>

          <footer className="mt-12 border-t border-white/[0.08] pt-6 text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Vawcom. HISAAB privacy policy.</p>
          </footer>
        </div>
      </SiteContainer>
    </article>
  );
}
