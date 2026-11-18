/**
 * RIBPI — Final record of the 2026 session (archive).
 *
 * Loaded only by 2026-session.html. js/site.js fills each
 * [data-status="<id>"] note and each [data-history="<id>"] list from it.
 * The session has adjourned, so this file should not need to change.
 */
var RIBPI_BILLS_META = {
  lastUpdated: 'November 17, 2026',
  session: '2026 Session, adjourned',
  calendar: [
    'The last floor votes were held June 11, 2026.',
    'Bills held for further study expired and must be introduced again in 2027.'
  ],
  verifiedAgainst: 'status.rilegislature.gov'
};

var RIBPI_BILLS = [
  {
    id: 's2198',
    numbers: 'S.2198 Sub A',
    title: 'Blockchain and Cryptocurrency Study Commission',
    status: 'Adopted by the Senate 38–0 on June 10, 2026 (Resolution 403).',
    history: [
      { date: 'January 23, 2026', action: 'Introduced in the Senate' },
      { date: 'June 10, 2026', action: 'Substitute A adopted by the Senate, 38–0' },
      { date: 'June 10, 2026', action: 'Enacted as Resolution 403; no House action required' }
    ],
    watchUrls: []
  },
  {
    id: 's2021',
    numbers: 'S.2021',
    title: 'Bitcoin Tax De Minimis Exemption',
    status: 'Held for further study June 8, 2026. Expired at adjournment.',
    history: [
      { date: 'January 9, 2026', action: 'Introduced, referred to Senate Finance' },
      { date: 'June 8, 2026', action: 'Heard; committee recommended the measure be held for further study' }
    ],
    watchUrls: []
  },
  {
    id: 'h7957',
    numbers: 'H.7957 / S.2196',
    title: 'Private Key Protection Act',
    status: 'Both bills held for further study. Expired at adjournment.',
    history: [
      { date: 'March 5, 2026', action: 'H.7957 heard in House Innovation, Internet & Technology; held for further study' },
      { date: 'April 7, 2026', action: 'S.2196 heard in Senate Artificial Intelligence & Emerging Technologies; held for further study' }
    ],
    watchUrls: []
  },
  {
    id: 'h7956',
    numbers: 'H.7956',
    title: 'Joint Study Commission (House version)',
    status: 'Held for further study March 5, 2026. Expired at adjournment.',
    history: [
      { date: 'March 5, 2026', action: 'Heard in House Innovation, Internet & Technology; held for further study' }
    ],
    watchUrls: []
  },
  {
    id: 'h7413',
    numbers: 'H.7413',
    title: 'Rhode Island Economic Growth Blockchain Act',
    status: 'Held for further study February 3, 2026. Expired at adjournment.',
    history: [
      { date: 'January 30, 2026', action: 'Introduced, referred to House Corporations' },
      { date: 'February 3, 2026', action: 'Heard; held for further study' }
    ],
    watchUrls: []
  },
  {
    id: 'h7843',
    numbers: 'H.7843',
    title: 'Rhode Island Decentralized Autonomous Organization Act',
    status: 'Held for further study April 2, 2026. Expired at adjournment.',
    history: [
      { date: 'February 27, 2026', action: 'Introduced, referred to House Corporations' },
      { date: 'April 2, 2026', action: 'Heard; held for further study' }
    ],
    watchUrls: []
  },
  {
    id: 'h7955',
    numbers: 'H.7955 / S.2648',
    title: 'Virtual Currency Kiosk Definitions',
    status: 'Both bills held for further study. Expired at adjournment.',
    history: [
      { date: 'March 5, 2026', action: 'H.7955 held for further study in House committee' },
      { date: 'April 14, 2026', action: 'S.2648 heard in Senate Commerce; held for further study' }
    ],
    watchUrls: []
  }
];

if (typeof window !== 'undefined') {
  window.RIBPI_BILLS = RIBPI_BILLS;
  window.RIBPI_BILLS_META = RIBPI_BILLS_META;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { RIBPI_BILLS: RIBPI_BILLS, RIBPI_BILLS_META: RIBPI_BILLS_META };
}
