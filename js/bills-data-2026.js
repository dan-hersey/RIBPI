/**
 * RIBPI — Final record of the 2026 session (archive).
 *
 * Loaded only by 2026-session.html, where it renders the at-a-glance
 * grid and the progress steppers (see js/bills-render.js). The session
 * has adjourned, so this file should not need to change. Current-session
 * data lives in js/bills-data.js.
 *
 * Stepper stages: each bill lists 4 steps. step.state is one of
 *   "done"    — completed (green check)
 *   "held"    — current stage, stalled (gold)
 *   "active"  — current stage, moving (orange pulse)
 *   "todo"    — not reached
 */
var RIBPI_BILLS_META = {
  lastUpdated: 'November 17, 2026',
  session: '2026 Legislative Session',
  sineDieLabel: '',
  verifiedAgainst: 'status.rilegislature.gov'
};

var RIBPI_BILLS = [
  {
    id: 's2021',
    anchor: 'bill-s2021',
    numbers: 'S.2021',
    cardNumbers: 'S2021',
    title: 'De Minimis Tax Exemption',
    stance: 'strong-support',
    stanceLabel: 'Strong Support',
    badge: { tone: 'committee', text: 'Held for Further Study · Jun 8' },
    tracker: {
      title: 'Bitcoin Tax De Minimis',
      status: 'Held Jun 8, 2026 · Expired'
    },
    ticker: { label: 'S.2021', tone: 'held', text: 'HELD FOR FURTHER STUDY · JUN 8' },
    featured: {
      order: 2,
      meta: 'Tax-free Bitcoin payments up to $5,000/month ($20,000/year) to reduce friction for everyday use. Heard by Senate Finance on June 8, 2026 and held for further study.'
    },
    steps: [
      { label: 'Introduced', note: 'Jan 9, 2026', state: 'done' },
      { label: 'Committee', note: 'Held Jun 8 · Senate Finance', state: 'held' },
      { label: 'Floor Vote', note: '', state: 'todo' },
      { label: 'Signed into Law', note: '', state: 'todo' }
    ],
    watchUrls: [
      'https://webserver.rilegislature.gov/Billtext/BillText26/SenateText26/S2021.pdf'
    ]
  },
  {
    id: 'h7956',
    anchor: 'bill-h7956',
    numbers: 'S.2198 Sub A',
    cardNumbers: 'S2198 Sub A',
    title: 'Blockchain Study Commission',
    stance: 'strong-support',
    stanceLabel: 'Strong Support',
    badge: { tone: 'success', text: 'Passed Senate · Jun 10' },
    tracker: {
      title: 'Blockchain Study Commission',
      status: 'Adopted · Senate 38–0 · Jun 10, 2026'
    },
    ticker: { label: 'S.2198 Sub A', tone: 'floor', text: 'PASSED SENATE UNANIMOUSLY · JUN 10' },
    featured: {
      order: 1,
      meta: 'Passed the Rhode Island Senate unanimously on June 10, 2026. Sub A converted the bill from a joint to a Senate-led commission, so passage establishes the 10-member Special Legislative Commission. Interim report due January 5, 2027; final report January 5, 2028.'
    },
    steps: [
      { label: 'Introduced', note: 'Jan 2026', state: 'done' },
      { label: 'Committee', note: 'Senate AI & Emerging Tech', state: 'done' },
      { label: 'Floor Vote', note: '38–0 · Jun 10', state: 'done' },
      { label: 'Adopted', note: 'Resolution 403', state: 'done' }
    ],
    watchUrls: [
      'https://webserver.rilegislature.gov/Billtext/BillText26/SenateText26/S2198A.pdf',
      'https://webserver.rilegislature.gov/Billtext/BillText26/HouseText26/H7956.pdf'
    ]
  },
  {
    id: 'h7957',
    anchor: 'bill-h7957',
    numbers: 'H.7957 / S.2196',
    cardNumbers: 'H7957 / S2196',
    title: 'Private Key Protection',
    stance: 'strong-support',
    stanceLabel: 'Strong Support',
    badge: { tone: 'committee', text: 'Held for Further Study' },
    tracker: {
      title: 'Private Key Protection',
      status: 'Held for Further Study · Expired'
    },
    ticker: { label: 'H.7957 / S.2196', tone: 'held', text: 'HELD' },
    featured: {
      order: 3,
      meta: 'Protects citizens from being compelled to disclose private cryptographic keys in legal proceedings. H.7957 held Mar 5; S.2196 held Apr 7.'
    },
    steps: [
      { label: 'Introduced', note: 'Jan–Feb 2026', state: 'done' },
      { label: 'Committee', note: 'H held Mar 5 · S held Apr 7', state: 'held' },
      { label: 'Floor Vote', note: '', state: 'todo' },
      { label: 'Signed into Law', note: '', state: 'todo' }
    ],
    watchUrls: [
      'https://webserver.rilegislature.gov/Billtext/BillText26/HouseText26/H7957.pdf',
      'https://webserver.rilegislature.gov/Billtext/BillText26/SenateText26/S2196.pdf'
    ]
  },
  {
    id: 'h7413',
    anchor: 'bill-h7413',
    numbers: 'H.7413',
    cardNumbers: 'H7413',
    title: 'Economic Growth Blockchain Act',
    stance: 'strong-support',
    stanceLabel: 'Strong Support',
    badge: { tone: 'committee', text: 'Held for Further Study' },
    tracker: {
      title: 'Blockchain Economic Growth Act',
      status: 'Held Feb 3, 2026 · Expired'
    },
    ticker: { label: 'H.7413', tone: 'held', text: 'HELD · FEB 3' },
    featured: {
      order: 4,
      meta: 'Regulatory sandbox and Special Purpose Depository Institutions to make RI a blockchain innovation hub. Held for further study Feb 3.'
    },
    steps: [
      { label: 'Introduced', note: 'Jan 30, 2026', state: 'done' },
      { label: 'Committee', note: 'Held Feb 3 · House Corporations', state: 'held' },
      { label: 'Floor Vote', note: '', state: 'todo' },
      { label: 'Signed into Law', note: '', state: 'todo' }
    ],
    watchUrls: [
      'https://webserver.rilegislature.gov/Billtext/BillText26/HouseText26/H7413.pdf'
    ]
  },
  {
    id: 'h7843',
    anchor: 'bill-h7843',
    numbers: 'H.7843',
    cardNumbers: 'H7843',
    title: 'DAO LLC Act',
    stance: 'support',
    stanceLabel: 'Support w/ Amendments',
    badge: { tone: 'committee', text: 'Held for Further Study · Apr 2' },
    tracker: {
      title: 'DAO LLC Act',
      status: 'Held Apr 2, 2026 · Expired'
    },
    ticker: { label: 'H.7843', tone: 'held', text: 'HELD · APR 2' },
    featured: null,
    steps: [
      { label: 'Introduced', note: 'Feb 27, 2026', state: 'done' },
      { label: 'Committee', note: 'Held Apr 2 · House Corporations', state: 'held' },
      { label: 'Floor Vote', note: '', state: 'todo' },
      { label: 'Signed into Law', note: '', state: 'todo' }
    ],
    watchUrls: [
      'https://webserver.rilegislature.gov/Billtext/BillText26/HouseText26/H7843.pdf'
    ]
  },
  {
    id: 'h7955',
    anchor: 'bill-h7955',
    numbers: 'H.7955 / S.2648',
    cardNumbers: 'H7955 / S2648',
    title: 'Kiosk Definition Expansion',
    stance: 'concerns',
    stanceLabel: 'Concerns',
    badge: { tone: 'committee', text: 'Both Held for Further Study' },
    tracker: {
      title: 'Kiosk Definition Expansion',
      status: 'Both Held · Expired'
    },
    ticker: { label: 'H.7955 / S.2648', tone: 'held', text: 'HELD' },
    featured: null,
    steps: [
      { label: 'Introduced', note: '2026', state: 'done' },
      { label: 'Committee', note: 'H held Mar 5 · S held Apr 14', state: 'held' },
      { label: 'Floor Vote', note: '', state: 'todo' },
      { label: 'Signed into Law', note: '', state: 'todo' }
    ],
    watchUrls: [
      'https://webserver.rilegislature.gov/Billtext/BillText26/HouseText26/H7955.pdf',
      'https://webserver.rilegislature.gov/Billtext/BillText26/SenateText26/S2648.pdf'
    ]
  },
  {
    id: 'h5121',
    anchor: 'bill-h5121',
    numbers: 'H.5121A / S.0016A',
    cardNumbers: 'H5121A / S0016A',
    title: 'Virtual Currency Kiosk Regulation',
    stance: 'concerns',
    stanceLabel: 'Concerns',
    badge: { tone: 'success', text: 'Enacted June 2025' },
    tracker: {
      title: 'Virtual Currency Kiosk Regulation',
      status: 'Enacted June 23, 2025',
      anchorOverride: 'bill-enacted'
    },
    href: 'legislation.html#bill-h5121',
    ticker: null,
    featured: null,
    steps: [
      { label: 'Introduced', note: '2025 session', state: 'done' },
      { label: 'Committee', note: 'Passed', state: 'done' },
      { label: 'Floor Vote', note: 'Passed both chambers', state: 'done' },
      { label: 'Signed into Law', note: 'June 2025', state: 'done' }
    ],
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
