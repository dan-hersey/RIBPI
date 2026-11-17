/**
 * RIBPI — Single source of truth for the current (2027) session.
 *
 * Edit THIS FILE ONLY when an agenda item changes status. The ticker,
 * homepage cards and the legislation at-a-glance grid all render from
 * this data (see js/bills-render.js).
 *
 * `lastUpdated` feeds every "status as of" label on the site.
 *
 * When a 2027 bill gets a number:
 *   - put it in `numbers` / `cardNumbers`
 *   - add the bill-text PDF to `watchUrls` so the nightly watcher
 *     (scripts/check-bill-status.mjs) starts tracking it
 *   - add `steps` (4 entries: state is "done" | "held" | "active" | "todo")
 *     if the item has a detailed .leg-bill-card on a page
 *
 * The final record of the 2026 session lives in js/bills-data-2026.js
 * and renders on 2026-session.html.
 */
var RIBPI_BILLS_META = {
  lastUpdated: 'November 17, 2026',
  session: '2027 Legislative Session',
  sineDieLabel: '',
  /* Extra ticker items that are dates, not bills. */
  tickerNotes: [
    { label: 'GENERAL ASSEMBLY', tone: 'hearing', text: 'CONVENES JAN 5, 2027' }
  ],
  verifiedAgainst: 'webserver.rilegislature.gov'
};

var RIBPI_BILLS = [
  {
    id: 'commission',
    anchor: 'education',
    href: '2027-agenda.html#education',
    numbers: 'S.2198 Sub A',
    cardNumbers: 'S2198 Sub A',
    title: 'Study Commission Education',
    stance: 'strong-support',
    stanceLabel: 'First Priority',
    badge: { tone: 'success', text: 'Created June 10, 2026' },
    tracker: {
      title: 'Education for the Study Commission',
      status: 'Interim report due Jan 5, 2027'
    },
    ticker: { label: 'STUDY COMMISSION', tone: 'floor', text: 'INTERIM REPORT DUE JAN 5, 2027' },
    featured: {
      order: 1,
      meta: 'The Senate created a 10-member commission to study blockchain and cryptocurrency. Briefing its members and other lawmakers is RIBPI’s first job in 2027. Interim report due January 5, 2027; final report January 5, 2028.'
    },
    steps: [],
    watchUrls: []
  },
  {
    id: 'private-key',
    anchor: 'private-key',
    href: '2027-agenda.html#private-key',
    numbers: '',
    cardNumbers: '2026: H7957 / S2196',
    title: 'Private Key Protection',
    stance: 'strong-support',
    stanceLabel: 'For Introduction',
    badge: { tone: 'committee', text: 'Returning in 2027' },
    tracker: {
      title: 'Private Key Protection Act',
      status: 'Returning · heard in both chambers in 2026'
    },
    ticker: { label: 'PRIVATE KEY PROTECTION', tone: 'hearing', text: 'RETURNING IN 2027' },
    featured: {
      order: 2,
      meta: 'A court or agency could not force someone to hand over a private key when a public key or the asset itself would do. Wyoming (2023) and Utah (2024) have this law.'
    },
    steps: [],
    watchUrls: []
  },
  {
    id: 'de-minimis',
    anchor: 'de-minimis',
    href: '2027-agenda.html#de-minimis',
    numbers: '',
    cardNumbers: '2026: S2021',
    title: 'Bitcoin Payments De Minimis',
    stance: 'strong-support',
    stanceLabel: 'For Introduction',
    badge: { tone: 'committee', text: 'Revised for 2027' },
    tracker: {
      title: 'Bitcoin Payments De Minimis',
      status: 'Revised after Senate Finance hearing'
    },
    ticker: { label: 'PAYMENTS DE MINIMIS', tone: 'hearing', text: 'REVISED FOR 2027' },
    featured: {
      order: 3,
      meta: 'Small everyday purchases made with bitcoin would no longer trigger a state income tax calculation. Redrafted to answer the Division of Taxation’s June 2026 letter on S.2021.'
    },
    steps: [],
    watchUrls: []
  },
  {
    id: 'unclaimed',
    anchor: 'unclaimed',
    href: '2027-agenda.html#unclaimed',
    numbers: '',
    cardNumbers: 'Ch. 33-21.1',
    title: 'Unclaimed Digital Assets',
    stance: 'strong-support',
    stanceLabel: 'For Introduction',
    badge: { tone: 'committee', text: 'New for 2027' },
    tracker: {
      title: 'Unclaimed Digital Assets',
      status: 'New · in drafting'
    },
    ticker: { label: 'UNCLAIMED DIGITAL ASSETS', tone: 'hearing', text: 'NEW FOR 2027' },
    featured: {
      order: 4,
      meta: 'Abandoned bitcoin would reach the General Treasurer as bitcoin, the way abandoned stock arrives as stock, so the owner can get the asset back. Virginia, Maine, Utah and Alabama enacted this in 2026.'
    },
    steps: [],
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
