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
    <article className="bg-[radial-gradient(circle_at_top,rgba(16,185,129,0.08),transparent_48%)] pb-[max(2.5rem,env(safe-area-inset-bottom,0px))] pt-[max(2rem,env(safe-area-inset-top,0px))]">
      <SiteContainer>
        <div className="mx-auto w-full max-w-3xl text-left">
          <header className="mb-8 border-b border-white/[0.08] pb-8 text-center">
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-emerald-400/90">HISAAB</p>
            <h1 className="mt-2 text-balance text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Privacy Policy
            </h1>
            <p className="mt-3 text-sm text-slate-500">Last updated: {LAST_UPDATED}</p>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-400">
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

          <nav
            aria-label="Privacy policy sections"
            className="mb-10 rounded-2xl border border-white/[0.1] bg-white/[0.03] p-4 backdrop-blur-sm sm:p-5"
          >
            <p className="text-center text-xs font-medium uppercase tracking-[0.14em] text-slate-500">Jump to section</p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-sm">
              <a href="#privacy-summary" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">1. Summary</a>
              <a href="#section-introduction" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">2. Introduction</a>
              <a href="#section-local-data" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">3. Local data</a>
              <a href="#section-sms" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">4. SMS access</a>
              <a href="#section-notifications" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">5. Notification access</a>
              <a href="#section-gmail" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">6. Gmail connection</a>
              <a href="#section-never-uploaded" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">7. Never uploaded</a>
              <a href="#section-network" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">8. Network and third parties</a>
              <a href="#section-backup" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">9. Backup and deletion</a>
              <a href="#section-security" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">10. Security</a>
              <a href="#section-children" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">11. Children&apos;s privacy</a>
              <a href="#section-changes" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">12. Policy changes</a>
              <a href="#section-contact" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">13. Contact</a>
              <a href="#section-retention" className="rounded-full border border-white/[0.12] bg-white/[0.02] px-3 py-1.5 text-slate-300 transition hover:border-emerald-400/45 hover:bg-emerald-500/[0.1] hover:text-white">14. Retention and deletion</a>
            </div>
          </nav>

          <section
            aria-labelledby="privacy-summary"
            className="mb-10 rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.07] px-5 py-5 shadow-[0_0_0_1px_rgba(16,185,129,0.08)] sm:px-6"
          >
            <h2 id="privacy-summary" className="text-lg font-semibold text-white">
              1. Summary
            </h2>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-slate-300 sm:text-[15px]">
              <li>
                <strong className="font-medium text-white">Your spending data stays on your phone.</strong>
              </li>
              <li>HISAAB has no backend server and does not upload your transaction history.</li>
              <li>SMS and notification access are used only to detect payment and transaction alerts.</li>
              <li>When enabled, a lightweight foreground service may run to keep payment capture reliable.</li>
              <li>HISAAB may show local notifications for capture or review prompts.</li>
              <li>&ldquo;Report an issue&rdquo; is user-initiated and opens your email app with optional debug details.</li>
              <li>You can delete data anytime by clearing app data or uninstalling HISAAB.</li>
              <li>Data is not sold, not used for ads, and not shared with third parties for marketing.</li>
            </ul>
          </section>

          <div className="space-y-6 text-sm leading-relaxed text-slate-400 sm:text-[15px] [&_a]:text-emerald-300 [&_a]:underline-offset-2 hover:[&_a]:text-emerald-200 hover:[&_a]:underline [&_code]:rounded [&_code]:bg-white/[0.06] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:text-[0.92em] [&_ul]:marker:text-emerald-400/70 [&>section]:rounded-2xl [&>section]:border [&>section]:border-white/[0.1] [&>section]:bg-white/[0.02] [&>section]:px-5 [&>section]:py-6 [&>section]:shadow-[0_16px_40px_-28px_rgba(0,0,0,0.9)] sm:[&>section]:px-7 sm:[&>section]:py-7">
            <section aria-labelledby="section-introduction">
              <h2 id="section-introduction" className="text-xl font-semibold text-white">
                2. Introduction
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
              <p className="mt-3">
                Android permissions may technically allow access to all SMS messages, but HISAAB filters for transaction
                alerts and ignores OTP and non-payment content in normal processing.
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
              <p className="mt-3">
                When notification access is enabled, HISAAB may run a lightweight foreground service while the app is in
                the background so payment alerts are not missed. This service is used only for transaction detection and
                does not upload your data.
              </p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Only used for payment-related notifications</li>
                <li>Processed on-device</li>
                <li>Not uploaded to Vawcom or any HISAAB server</li>
                <li>HISAAB may request <code className="text-slate-300">POST_NOTIFICATIONS</code> for local app alerts</li>
                <li>Local notifications are generated on-device and are not sent to us</li>
                <li>You enable and can revoke this in Android Settings → Notification access</li>
                <li>If permissions remain enabled, capture may resume after device restart</li>
              </ul>
            </section>

            <section aria-labelledby="section-gmail">
              <h2 id="section-gmail" className="text-xl font-semibold text-white">
                6. Optional Gmail connection
              </h2>
              <p className="mt-3">You may optionally connect your Google account to import payment emails.</p>
              <ul className="mt-3 list-disc space-y-2 pl-5">
                <li>Uses Google Sign-In and the Gmail API</li>
                <li>Uses read-only Gmail access for payment-related import</li>
                <li>Reads payment-related emails from your mailbox</li>
                <li>Does not upload email content to HISAAB or Vawcom servers</li>
                <li>OAuth tokens are stored securely on your device</li>
                <li>Google&apos;s privacy policy also applies when you connect Gmail</li>
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
                <li>You may import a previously exported backup file; imported data stays on your device</li>
                <li>If you export or share a backup file, you control where it goes (for example email or cloud drive)</li>
                <li>Vawcom does not receive exported backup files unless you send them to us directly</li>
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
              <p className="mt-3">
                If you choose &ldquo;Report an issue&rdquo; in the app, your email app may include app version, device
                type, and optional locally stored crash details in the draft sent to this address. Spending history and SMS
                content are not included unless you add them yourself.
              </p>
            </section>

            <section aria-labelledby="section-retention">
              <h2 id="section-retention" className="text-xl font-semibold text-white">
                14. Data retention and deletion
              </h2>
              <p className="mt-3">
                Transaction data is kept on your device until you delete it, clear app data, uninstall HISAAB, or restore
                from a backup. We do not retain copies on developer servers because HISAAB has no backend server for
                transaction storage.
              </p>
            </section>
          </div>

          <footer className="mt-12 border-t border-white/[0.08] pt-6 text-center text-xs text-slate-500">
            <p>© {new Date().getFullYear()} Vawcom. HISAAB privacy policy.</p>
          </footer>
        </div>
      </SiteContainer>
    </article>
  );
}
