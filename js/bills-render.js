/**
 * RIBPI — Renders bill-driven UI from js/bills-data.js.
 *
 * Targets (each optional; renders only what the page contains):
 *   .session-ticker-inner       — scrolling status ticker (+ live BTC price)
 *   [data-bills-grid]           — homepage featured bill cards
 *   [data-bills-tracker]        — legislation at-a-glance tracker grid
 *   .leg-bill-card[id^=bill-]   — progress stepper injected per bill
 *   [data-counter]              — count-up stat animation
 *   [data-last-updated]         — text swapped for RIBPI_BILLS_META.lastUpdated
 *
 * No frameworks, no dependencies. Respects prefers-reduced-motion.
 */
(function () {
  'use strict';

  var BILLS = window.RIBPI_BILLS || [];
  var META = window.RIBPI_BILLS_META || {};
  var reducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------ *
   * Session ticker
   * ------------------------------------------------------------------ */
  var btcTickerHtml = ''; // filled by fetchBtcPrice()

  function tickerItemHtml(b) {
    return '<span class="session-ticker-item">' +
      '<span class="session-ticker-bill">' + b.ticker.label + '</span> ' +
      '<span class="session-ticker-status-' + b.ticker.tone + '">' + b.ticker.text + '</span>' +
      '</span>';
  }

  function renderTicker() {
    var inners = document.querySelectorAll('.session-ticker-inner');
    if (!inners.length) return;

    var sep = '<span class="session-ticker-sep">&bull;</span>';
    var items = [];
    BILLS.forEach(function (b) { if (b.ticker) items.push(tickerItemHtml(b)); });
    (META.tickerNotes || []).forEach(function (n) {
      items.push(tickerItemHtml({ ticker: n }));
    });
    if (META.sineDieLabel) {
      items.push('<span class="session-ticker-item">' + META.sineDieLabel + '</span>');
    }
    if (btcTickerHtml) items.push(btcTickerHtml);

    var seq = items.join(sep) + sep;
    // Two copies so the -50% translate loop is seamless.
    var html = seq + ' ' + seq;
    inners.forEach(function (el) { el.innerHTML = html; });
  }

  /* ------------------------------------------------------------------ *
   * Live BTC price (CoinGecko, cached 10 min, fails silently)
   * ------------------------------------------------------------------ */
  function fetchBtcPrice() {
    if (!document.querySelector('.session-ticker-inner') || !window.fetch) return;

    var CACHE_KEY = 'ribpi-btc-usd';
    var TEN_MIN = 10 * 60 * 1000;

    function show(price) {
      var formatted = '$' + Math.round(price).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
      btcTickerHtml = '<span class="session-ticker-item">' +
        '<span class="session-ticker-bill">BTC</span> ' +
        '<span class="session-ticker-btc">' + formatted + ' USD</span>' +
        '</span>';
      renderTicker();
    }

    try {
      var cached = JSON.parse(sessionStorage.getItem(CACHE_KEY) || 'null');
      if (cached && (Date.now() - cached.t) < TEN_MIN) { show(cached.p); return; }
    } catch (e) { /* ignore */ }

    fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
      .then(function (r) { return r.ok ? r.json() : null; })
      .then(function (j) {
        var p = j && j.bitcoin && j.bitcoin.usd;
        if (!p) return;
        try { sessionStorage.setItem(CACHE_KEY, JSON.stringify({ p: p, t: Date.now() })); } catch (e) {}
        show(p);
      })
      .catch(function () { /* ticker simply omits the price */ });
  }

  /* ------------------------------------------------------------------ *
   * Homepage featured bill cards
   * ------------------------------------------------------------------ */
  function renderFeaturedGrid() {
    var grid = document.querySelector('[data-bills-grid]');
    if (!grid) return;

    var featured = BILLS.filter(function (b) { return b.featured; })
      .sort(function (a, b) { return a.featured.order - b.featured.order; });

    grid.innerHTML = featured.map(function (b) {
      var badgeClass = b.badge.tone === 'success' ? 'badge-success' : 'badge-committee';
      var href = b.href || ('legislation.html#' + b.anchor);
      return '<a href="' + href + '" class="card bill-card">' +
        '<div class="card-header">' +
        '<div class="bill-numbers">' + b.cardNumbers + '</div>' +
        '<span class="badge ' + badgeClass + '">' + b.badge.text + '</span>' +
        '</div>' +
        '<h3 class="card-title">' + b.title + '</h3>' +
        '<p class="card-meta">' + b.featured.meta + '</p>' +
        '</a>';
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * Legislation at-a-glance tracker grid
   * ------------------------------------------------------------------ */
  function renderTrackerGrid() {
    var grid = document.querySelector('[data-bills-tracker]');
    if (!grid) return;

    grid.innerHTML = BILLS.map(function (b) {
      var anchor = (b.tracker && b.tracker.anchorOverride) || b.anchor;
      var href = b.href || ('#' + anchor);
      return '<a href="' + href + '" class="leg-tracker-card leg-tracker-card--' + b.stance + '">' +
        (b.numbers ? '<div class="leg-tracker-bill">' + b.numbers + '</div>' : '') +
        '<div class="leg-tracker-title">' + b.tracker.title + '</div>' +
        '<div class="leg-tracker-stance">' + b.stanceLabel + '</div>' +
        '<div class="leg-tracker-status">' + b.tracker.status + '</div>' +
        '</a>';
    }).join('');
  }

  /* ------------------------------------------------------------------ *
   * Progress steppers — injected into each detailed bill card
   * ------------------------------------------------------------------ */
  function stepperHtml(b) {
    var steps = b.steps.map(function (s) {
      var icon = s.state === 'done' ? '✓' : (s.state === 'held' ? '◌' : (s.state === 'active' ? '●' : ''));
      return '<li class="bill-step bill-step--' + s.state + '">' +
        '<span class="bill-step-dot" aria-hidden="true">' + icon + '</span>' +
        '<span class="bill-step-label">' + s.label + '</span>' +
        (s.note ? '<span class="bill-step-note">' + s.note + '</span>' : '') +
        '</li>';
    }).join('');
    return '<ol class="bill-stepper" aria-label="Bill progress for ' + b.numbers + '">' + steps + '</ol>';
  }

  function renderSteppers() {
    BILLS.forEach(function (b) {
      if (!b.steps || !b.steps.length) return;
      var card = document.getElementById(b.anchor);
      if (!card || !card.classList.contains('leg-bill-card')) return;
      if (card.querySelector('.bill-stepper')) return;
      var content = card.querySelector('.leg-bill-content');
      var meta = card.querySelector('.leg-bill-meta');
      if (!content) return;
      var holder = document.createElement('div');
      holder.innerHTML = stepperHtml(b);
      content.insertBefore(holder.firstChild, meta || content.children[1] || null);
    });
  }

  /* ------------------------------------------------------------------ *
   * "Status as of" labels
   * ------------------------------------------------------------------ */
  function renderLastUpdated() {
    if (!META.lastUpdated) return;
    document.querySelectorAll('[data-last-updated]').forEach(function (el) {
      el.textContent = META.lastUpdated;
    });
  }

  /* ------------------------------------------------------------------ *
   * Count-up stat animation
   *   <span data-counter data-target="52.4" data-decimals="1" data-suffix="%"></span>
   * ------------------------------------------------------------------ */
  function formatCounterValue(el, value) {
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var prefix = el.getAttribute('data-prefix') || '';
    var suffix = el.getAttribute('data-suffix') || '';
    var num = decimals > 0 ? value.toFixed(decimals) : Math.round(value).toString();
    el.textContent = prefix + num + suffix;
  }

  function runCounter(el) {
    var target = parseFloat(el.getAttribute('data-target'));
    if (isNaN(target)) return;
    if (reducedMotion) { formatCounterValue(el, target); return; }

    var duration = 1600;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / duration, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      formatCounterValue(el, target * eased);
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  function initCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    if (!counters.length) return;

    if (!('IntersectionObserver' in window)) {
      counters.forEach(function (el) { formatCounterValue(el, parseFloat(el.getAttribute('data-target')) || 0); });
      return;
    }
    var seen = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          seen.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function (el) { seen.observe(el); });
  }

  /* ------------------------------------------------------------------ *
   * Anchor highlight — flash the targeted bill card after a jump
   * ------------------------------------------------------------------ */
  function flashTarget() {
    var hash = window.location.hash;
    if (!hash) return;
    var el = null;
    try { el = document.querySelector(hash); } catch (e) { return; }
    if (!el) return;
    var card = el.classList.contains('leg-bill-card') ? el : el.querySelector('.leg-bill-card');
    if (!card) card = el;
    card.classList.remove('anchor-flash');
    // Force reflow so re-navigating to the same hash re-triggers the flash.
    void card.offsetWidth;
    card.classList.add('anchor-flash');
    setTimeout(function () { card.classList.remove('anchor-flash'); }, 2600);
  }

  /* ------------------------------------------------------------------ *
   * Init
   * ------------------------------------------------------------------ */
  function init() {
    renderTicker();
    renderFeaturedGrid();
    renderTrackerGrid();
    renderSteppers();
    renderLastUpdated();
    initCounters();
    fetchBtcPrice();
    flashTarget();
    window.addEventListener('hashchange', flashTarget);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
