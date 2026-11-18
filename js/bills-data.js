/**
 * RIBPI — Single source of truth for the current (2027) session.
 *
 * Edit THIS FILE ONLY when something changes. js/site.js reads it and fills:
 *   - the calendar line under the header on every page (META.calendar)
 *   - every [data-last-updated] label (META.lastUpdated)
 *   - every [data-status="<id>"] note (the item's `status`)
 *
 * When a 2027 bill gets a number:
 *   - put it in `numbers`
 *   - update `status`
 *   - add the bill-text PDF to `watchUrls` so the nightly watcher
 *     (scripts/check-bill-status.mjs) starts tracking it
 *
 * The final record of the 2026 session lives in js/bills-data-2026.js.
 */
var RIBPI_BILLS_META = {
  lastUpdated: 'November 17, 2026',
  session: '2027 Legislative Session',
  /* Plain sentences. Shown in order after the session name. */
  calendar: [
    'The General Assembly convenes January 5, 2027.',
    'The study commission’s interim report is due the same day.'
  ],
  verifiedAgainst: 'webserver.rilegislature.gov'
};

var RIBPI_BILLS = [
  {
    id: 'commission',
    numbers: 'S.2198 Sub A (Resolution 403)',
    title: 'Special Legislative Commission to Study Blockchain and Cryptocurrency',
    status: 'Created June 10, 2026. Appointments not yet announced.',
    watchUrls: []
  },
  {
    id: 'private-key',
    numbers: '',
    title: 'Private Key Protection Act',
    status: 'Returning in 2027. Not yet filed.',
    watchUrls: []
  },
  {
    id: 'de-minimis',
    numbers: '',
    title: 'Bitcoin Payments De Minimis Exemption',
    status: 'Being redrafted for 2027. Not yet filed.',
    watchUrls: []
  },
  {
    id: 'unclaimed',
    numbers: '',
    title: 'Unclaimed Digital Assets Act',
    status: 'New for 2027. In drafting.',
    watchUrls: []
  }
];

/* Browser global + Node export (used by scripts/check-bill-status.mjs) */
if (typeof window !== 'undefined') {
  window.RIBPI_BILLS = RIBPI_BILLS;
  window.RIBPI_BILLS_META = RIBPI_BILLS_META;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RIBPI_BILLS: RIBPI_BILLS, RIBPI_BILLS_META: RIBPI_BILLS_META };
}
