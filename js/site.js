/**
 * ribpi.com — site behavior. No dependencies.
 *
 *  - theme toggle (remembered in localStorage as "ribpi-theme")
 *  - mobile menu
 *  - calendar line under the header, from js/bills-data.js (+ live bitcoin price)
 *  - [data-status="<bill id>"], [data-history="<bill id>"], [data-last-updated]
 *    filled from the bill data so statuses are edited in one place
 *  - line numbers in the left margin of every .lines block
 *  - one-time drawing of the strike and underline markup on .draw blocks
 *  - glossary search and news filters
 */
(function () {
  'use strict';

  var BILLS = window.RIBPI_BILLS || [];
  var META = window.RIBPI_BILLS_META || {};
  var root = document.documentElement;
  var reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function each(sel, fn, ctx) { Array.prototype.forEach.call((ctx || document).querySelectorAll(sel), fn); }
  function billById(id) { for (var i = 0; i < BILLS.length; i++) { if (BILLS[i].id === id) return BILLS[i]; } return null; }

  /* ---- Theme ---- */
  function setThemeLabel() {
    each('[data-theme-toggle]', function (b) {
      var dark = root.getAttribute('data-theme') === 'dark';
      b.textContent = dark ? 'Light' : 'Dark';
      b.setAttribute('aria-label', dark ? 'Switch to the light theme' : 'Switch to the dark theme');
    });
  }
  each('[data-theme-toggle]', function (b) {
    b.addEventListener('click', function () {
      var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', next);
      try { localStorage.setItem('ribpi-theme', next); } catch (e) {}
      setThemeLabel();
    });
  });
  setThemeLabel();

  /* ---- Menu ---- */
  each('[data-menu]', function (btn) {
    var nav = document.getElementById(btn.getAttribute('aria-controls'));
    if (!nav) return;
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
      btn.textContent = open ? 'Close' : 'Menu';
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open'); btn.setAttribute('aria-expanded', 'false'); btn.textContent = 'Menu'; btn.focus();
      }
    });
  });

  /* ---- Calendar line ---- */
  var calEl = document.querySelector('[data-calendar]');
  var calText = (META.calendar || []).join(' ');
  function renderCal(price) {
    if (!calEl) return;
    calEl.textContent = '';
    var b = document.createElement('b');
    b.textContent = (META.session || 'Calendar') + '. ';
    calEl.appendChild(b);
    calEl.appendChild(document.createTextNode(calText + (price ? ' Bitcoin: ' + price + '.' : '')));
  }
  renderCal('');
  if (calEl && window.fetch) {
    var KEY = 'ribpi-btc-usd', TEN_MIN = 600000;
    var show = function (p) { renderCal('$' + Math.round(p).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')); };
    var cached = null;
    try { cached = JSON.parse(sessionStorage.getItem(KEY) || 'null'); } catch (e) {}
    if (cached && Date.now() - cached.t < TEN_MIN) {
      show(cached.p);
    } else {
      fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=usd')
        .then(function (r) { return r.ok ? r.json() : null; })
        .then(function (j) {
          var p = j && j.bitcoin && j.bitcoin.usd;
          if (!p) return;
          try { sessionStorage.setItem(KEY, JSON.stringify({ p: p, t: Date.now() })); } catch (e) {}
          show(p);
        })
        .catch(function () {});
    }
  }

  /* ---- Data-bound text ---- */
  each('[data-last-updated]', function (el) { if (META.lastUpdated) el.textContent = META.lastUpdated; });
  each('[data-status]', function (el) {
    var b = billById(el.getAttribute('data-status'));
    if (b && b.status) el.textContent = b.status;
  });
  each('[data-history]', function (el) {
    var b = billById(el.getAttribute('data-history'));
    if (!b || !b.history || !b.history.length) return;
    el.textContent = '';
    b.history.forEach(function (h) {
      var li = document.createElement('li');
      var d = document.createElement('span'); d.textContent = h.date;
      var t = document.createElement('span'); t.textContent = h.action;
      li.appendChild(d); li.appendChild(t); el.appendChild(li);
    });
  });

  /* ---- Line numbers ---- */
  var blocks = Array.prototype.slice.call(document.querySelectorAll('.lines'));
  function numberLines() {
    var n = 0;
    blocks.forEach(function (block) {
      var lh = parseFloat(getComputedStyle(block).lineHeight) || 30;
      var gutter = block.querySelector(':scope > .ln');
      if (gutter) gutter.style.display = 'none';
      var count = Math.max(1, Math.round(block.getBoundingClientRect().height / lh));
      if (!gutter) {
        gutter = document.createElement('div');
        gutter.className = 'ln';
        gutter.setAttribute('aria-hidden', 'true');
        block.appendChild(gutter);
      }
      if (block.hasAttribute('data-restart')) n = 0;
      var html = '';
      for (var i = 0; i < count; i++) { n++; html += '<span>' + n + '</span>'; }
      gutter.innerHTML = html;
      gutter.style.display = '';
    });
  }
  if (blocks.length) {
    numberLines();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(numberLines);
    window.addEventListener('load', numberLines);
    var t;
    window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(numberLines, 120); });
  }

  /* ---- Markup drawing (once) ---- */
  var draws = Array.prototype.slice.call(document.querySelectorAll('[data-draw]'));
  if (draws.length && !reduced && 'IntersectionObserver' in window) {
    var marks = [];
    draws.forEach(function (d) {
      d.classList.add('draw');
      Array.prototype.push.apply(marks, d.querySelectorAll('ins, del'));
    });
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
      });
    }, { threshold: 0.01 });
    requestAnimationFrame(function () { marks.forEach(function (m) { io.observe(m); }); });
    window.addEventListener('beforeprint', function () { marks.forEach(function (m) { m.classList.add('on'); }); });
  }
  window.addEventListener('beforeprint', numberLines);
  window.addEventListener('afterprint', numberLines);
  if (window.matchMedia) {
    var printQuery = window.matchMedia('print');
    var renumber = function () { numberLines(); };
    if (printQuery.addEventListener) printQuery.addEventListener('change', renumber);
    else if (printQuery.addListener) printQuery.addListener(renumber);
  }

  /* ---- Filters (glossary categories, news categories) and glossary search ---- */
  each('[data-filter-group]', function (group) {
    var target = document.querySelector(group.getAttribute('data-filter-group'));
    if (!target) return;
    var search = document.querySelector('[data-filter-search="' + group.getAttribute('data-filter-group') + '"]');
    var active = 'all';
    function apply() {
      var q = search ? search.value.trim().toLowerCase() : '';
      var shown = 0;
      each('[data-category]', function (item) {
        var okCat = active === 'all' || item.getAttribute('data-category') === active;
        var hay = ((item.getAttribute('data-terms') || '') + ' ' + item.textContent).toLowerCase();
        var ok = okCat && (!q || hay.indexOf(q) !== -1);
        item.hidden = !ok;
        if (ok) shown++;
      }, target);
      each('[data-letter]', function (sec) {
        sec.hidden = !sec.querySelector('[data-category]:not([hidden])');
      }, target);
      var empty = document.querySelector('[data-filter-empty="' + group.getAttribute('data-filter-group') + '"]');
      if (empty) empty.hidden = shown !== 0;
      numberLines();
    }
    each('button[data-filter]', function (btn) {
      btn.addEventListener('click', function () {
        active = btn.getAttribute('data-filter');
        each('button[data-filter]', function (b) { b.setAttribute('aria-pressed', b === btn ? 'true' : 'false'); }, group);
        apply();
      });
    }, group);
    if (search) search.addEventListener('input', apply);
  });
  /* Stacked tables: label each cell with its column heading for phones */
  Array.prototype.forEach.call(document.querySelectorAll('table.stack'), function (t) {
    var heads = Array.prototype.map.call(t.querySelectorAll('thead th'), function (th) { return th.textContent.trim(); });
    Array.prototype.forEach.call(t.querySelectorAll('tbody tr'), function (tr) {
      Array.prototype.forEach.call(tr.children, function (td, i) { if (heads[i]) td.setAttribute('data-label', heads[i]); });
    });
  });
})();
