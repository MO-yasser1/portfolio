/**
 * ============================================================================
 * MOHAMED YASSER - PORTFOLIO v2 SCRIPT (Vanilla JS, بدون مكتبات)
 * ----------------------------------------------------------------------------
 * 1. اللغة (عربي / English)      6. حركة الصورة والتحريك
 * 2. الوضع الداكن / الفاتح       7. خطوات "رحلة العمل"
 * 3. قائمة الموبايل              8. كروت المشاريع
 * 4. الأقسام + الشريط الجانبي    9. نموذج التواصل
 * 5. Reveal عند السكرول          10. الأزرار العائمة
 * ============================================================================
 */
(function () {
  'use strict';

  var D = document, root = D.documentElement;
  var $ = function (s, c) { return (c || D).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || D).querySelectorAll(s)); };
  var KEY_THEME = 'mohamed_yasser_portfolio_theme';
  var KEY_LANG = 'mohamed_yasser_portfolio_lang';
  var WA_NUMBER = '201142576116';
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  var I = window.I18N || { en: {}, ar: {} };
  var lang = root.lang === 'en' ? 'en' : 'ar';

  function store(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"']/g, function (m) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]; }); }

  /** نص لغة حالية للمفاتيح المستخدمة داخل JS */
  function tr(key, vars) {
    var s = (I[lang] && I[lang][key]);
    if (s === undefined) s = (I.ar && I.ar[key]);
    if (s === undefined) s = key;
    if (vars) s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    return s;
  }

  /* ------------------------------------------------------------------------
   * 0. Marquee: نكرر القائمة ليدور الشريط بلا انقطاع
   * ---------------------------------------------------------------------- */
  (function marquee() {
    var list = $('.marquee-list'); if (!list) return;
    for (var i = 0; i < 3; i++) {
      var c = list.cloneNode(true); c.setAttribute('aria-hidden', 'true');
      list.parentNode.appendChild(c);
    }
  })();

  /* ------------------------------------------------------------------------
   * 1. اللغة
   * ---------------------------------------------------------------------- */
  function applyLang(next) {
    lang = next;
    root.lang = next;
    root.dir = next === 'en' ? 'ltr' : 'rtl';
    var EN = I.en;

    $$('[data-i18n]').forEach(function (el) {
      if (el.dataset.ar === undefined) el.dataset.ar = el.innerHTML;
      var k = el.getAttribute('data-i18n');
      el.innerHTML = (next === 'en' && EN[k] !== undefined) ? EN[k] : el.dataset.ar;
    });

    $$('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var parts = pair.split(':'), attr = parts[0].trim(), key = parts[1].trim();
        var store_k = 'ar_' + attr.replace(/-/g, '_');
        if (el.dataset[store_k] === undefined) el.dataset[store_k] = el.getAttribute(attr) || '';
        el.setAttribute(attr, (next === 'en' && EN[key] !== undefined) ? EN[key] : el.dataset[store_k]);
      });
    });

    D.title = tr('meta.title');
    var md = $('meta[name="description"]'); if (md) md.setAttribute('content', tr('meta.desc'));
    var ogt = $('meta[property="og:title"]'); if (ogt) ogt.setAttribute('content', tr('meta.title'));
    var ogl = $('meta[property="og:locale"]'); if (ogl) ogl.setAttribute('content', next === 'en' ? 'en_US' : 'ar_EG');

    var waFab = $('#fab-wa');
    if (waFab) waFab.href = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(tr('wa.default'));

    var y = $('#current-year'); if (y) y.textContent = new Date().getFullYear();
    store(KEY_LANG, next);
    renderProjects();
    layoutSteps();
  }

  var langBtn = $('#lang-toggle');
  if (langBtn) langBtn.addEventListener('click', function () { applyLang(lang === 'ar' ? 'en' : 'ar'); });

  /* ------------------------------------------------------------------------
   * 2. الوضع الداكن / الفاتح (دائرة تتسع من الزر)
   * ---------------------------------------------------------------------- */
  function setTheme(t) {
    root.setAttribute('data-theme', t);
    store(KEY_THEME, t);
    var m = $('meta[name="theme-color"]'); if (m) m.setAttribute('content', t === 'light' ? '#F2F9FA' : '#051A21');
  }
  var themeBtn = $('#theme-toggle');
  setTheme(root.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
  if (themeBtn) themeBtn.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    if (!D.startViewTransition || reduced) { setTheme(next); return; }
    var r = themeBtn.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
    var vt = D.startViewTransition(function () { setTheme(next); });
    vt.ready.then(function () {
      root.animate(
        { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + radius + 'px at ' + x + 'px ' + y + 'px)'] },
        { duration: 750, easing: 'cubic-bezier(.16,1,.3,1)', pseudoElement: '::view-transition-new(root)' }
      );
    }).catch(function () {});
  });

  /* ------------------------------------------------------------------------
   * 3. قائمة الموبايل
   * ---------------------------------------------------------------------- */
  var menuBtn = $('#menu-toggle'), menu = $('#mobile-menu');
  function setMenu(open) {
    if (!menuBtn || !menu) return;
    menuBtn.setAttribute('aria-expanded', String(open));
    menu.classList.toggle('open', open);
    menu.setAttribute('aria-hidden', String(!open));
    D.body.classList.toggle('menu-open', open);
  }
  if (menuBtn && menu) {
    menuBtn.addEventListener('click', function () { setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'); });
    $$('a', menu).forEach(function (a) { a.addEventListener('click', function () { setMenu(false); }); });
    D.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
    window.addEventListener('resize', function () { if (innerWidth > 960) setMenu(false); });
  }

  /* ------------------------------------------------------------------------
   * 4. القسم الحالي + شريط التقدم + الشريط الجانبي
   * ---------------------------------------------------------------------- */
  var sectionIds = ['hero', 'about', 'services', 'skills', 'projects', 'how-i-work', 'why-me', 'contact'];
  var navLinks = $$('.nav-link, .m-link, .rail a');
  function setActive(id) {
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === '#' + id); });
  }
  if ('IntersectionObserver' in window) {
    var secObs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) setActive(en.target.id); });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sectionIds.forEach(function (id) { var el = D.getElementById(id); if (el) secObs.observe(el); });
  }
  setActive('hero');

  var progFill = $('#progress-fill'), rail = $('#rail'), ticking = false;
  function onScroll() {
    ticking = false;
    var max = D.documentElement.scrollHeight - innerHeight;
    var p = max > 0 ? Math.min(1, Math.max(0, scrollY / max)) : 0;
    if (progFill) progFill.style.setProperty('--sp', p.toFixed(4));
    if (rail) rail.style.setProperty('--rp', p.toFixed(4));
    updateSteps();
  }
  window.addEventListener('scroll', function () { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });

  /* ------------------------------------------------------------------------
   * 5. Reveal عند السكرول (مع تأخير متدرج بين الإخوة)
   * ---------------------------------------------------------------------- */
  var revealObs = ('IntersectionObserver' in window && !reduced) ? new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) { en.target.classList.add('in'); revealObs.unobserve(en.target); }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' }) : null;

  function observeReveals(scope) {
    var groups = new Map();
    $$('.reveal:not(.in)', scope).forEach(function (el) {
      if (el.__seen) return; el.__seen = true;
      var n = groups.get(el.parentNode) || 0; groups.set(el.parentNode, n + 1);
      el.style.setProperty('--rd', Math.min(n, 5) * 0.08 + 's');
      if (revealObs) revealObs.observe(el); else el.classList.add('in');
    });
  }

  /* ------------------------------------------------------------------------
   * 6. حركة الدخول + ميل الصورة + إضاءة الكروت
   * ---------------------------------------------------------------------- */
  var fontsReady = (D.fonts && D.fonts.ready) ? D.fonts.ready : Promise.resolve();
  Promise.race([fontsReady, new Promise(function (r) { setTimeout(r, 1200); })]).then(function () {
    requestAnimationFrame(function () { root.classList.add('ready'); });
  });

  var stage = $('#stage');
  if (stage && finePointer && !reduced) {
    var vis = stage.parentNode;
    vis.addEventListener('pointermove', function (e) {
      var r = stage.getBoundingClientRect();
      var x = ((e.clientX - r.left) / r.width - 0.5) * 2;
      var y = ((e.clientY - r.top) / r.height - 0.5) * 2;
      x = Math.max(-1.2, Math.min(1.2, x)); y = Math.max(-1.2, Math.min(1.2, y));
      stage.style.setProperty('--ry', (x * 7).toFixed(2) + 'deg');
      stage.style.setProperty('--rx', (-y * 6).toFixed(2) + 'deg');
      stage.style.setProperty('--tx', (x * 14).toFixed(1) + 'px');
      stage.style.setProperty('--ty', (y * 14).toFixed(1) + 'px');
    });
    vis.addEventListener('pointerleave', function () {
      ['--ry', '--rx', '--tx', '--ty'].forEach(function (p) { stage.style.removeProperty(p); });
    });
  }

  D.addEventListener('pointermove', function (e) {
    var el = e.target.closest && e.target.closest('.spot');
    if (!el) return;
    var r = el.getBoundingClientRect();
    el.style.setProperty('--mx', (e.clientX - r.left + 20) + 'px');
    el.style.setProperty('--my', (e.clientY - r.top) + 'px');
  }, { passive: true });

  /* ------------------------------------------------------------------------
   * 7. رحلة العمل: الخط يُرسم مع السكرول والخطوات تُضاء
   * ---------------------------------------------------------------------- */
  var stepsEl = $('#steps');
  function layoutSteps() {
    if (!stepsEl) return;
    var nums = $$('.step-num', stepsEl); if (nums.length < 2) return;
    var a = nums[0].getBoundingClientRect(), b = nums[nums.length - 1].getBoundingClientRect();
    stepsEl.style.setProperty('--lh', Math.max(0, b.top - a.top) + 'px');
    updateSteps();
  }
  function updateSteps() {
    if (!stepsEl) return;
    var nums = $$('.step-num', stepsEl); if (nums.length < 2) return;
    var line = innerHeight * 0.62;
    var first = nums[0].getBoundingClientRect(), last = nums[nums.length - 1].getBoundingClientRect();
    var span = last.top - first.top || 1;
    var p = Math.min(1, Math.max(0, (line - first.top - 26) / span));
    stepsEl.style.setProperty('--p', p.toFixed(4));
    $$('.step', stepsEl).forEach(function (st, i) {
      st.classList.toggle('on', nums[i].getBoundingClientRect().top < line);
    });
  }
  window.addEventListener('resize', layoutSteps);

  /* ------------------------------------------------------------------------
   * 8. كروت المشاريع (من js/projects.js)
   * ---------------------------------------------------------------------- */
  var projectsRendered = false;
  function renderProjects() {
    var wrap = $('#plates'); if (!wrap || !window.PROJECTS) return;
    var mode = window.PROJECTS_LAYOUT || 'auto';
    wrap.classList.toggle('compact', mode === 'compact' || (mode === 'auto' && window.PROJECTS.length > 4));
    var seen = $$('.plate.in', wrap).map(function (el) { return el.getAttribute('data-i'); });

    wrap.innerHTML = window.PROJECTS.map(function (p, i) {
      var L = p[lang] || p.ar || {};
      var live = p.status === 'live';
      var tags = (L.tags || []).map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
      var foot = p.link
        ? '<a class="plate-link" href="' + esc(p.link) + '" target="_blank" rel="noopener noreferrer"><span>' + esc(tr('pr.visit')) + '</span><svg class="ico" aria-hidden="true"><use href="#i-external"/></svg></a>'
        : '<span class="plate-hint"><svg class="ico" aria-hidden="true"><use href="#i-clock"/></svg>' + esc(tr('pr.soon')) + '</span>';
      return '' +
        '<article class="plate reveal" data-i="' + i + '">' +
          '<div class="plate-visual"><div class="plate-stage" data-tone="' + esc(p.tone || 'teal') + '" role="img" aria-label="' + esc(L.title || '') + '">' + window.renderMockup(p, L.title || '') + '</div></div>' +
          '<div class="plate-info">' +
            '<div class="plate-meta"><span class="plate-cat">' + esc(L.category || '') + '</span><span class="status-pill' + (live ? ' live' : '') + '">' + esc(tr(live ? 'pr.status.live' : 'pr.status.wip')) + '</span></div>' +
            '<h3 class="plate-title">' + esc(L.title || '') + '</h3>' +
            '<p class="plate-desc">' + esc(L.desc || '') + '</p>' +
            '<ul class="plate-tags">' + tags + '</ul>' +
            '<div class="plate-foot">' + foot + '</div>' +
          '</div>' +
        '</article>';
    }).join('');

    $$('.plate', wrap).forEach(function (pl) {
      if (projectsRendered && seen.indexOf(pl.getAttribute('data-i')) > -1) { pl.classList.add('in'); pl.__seen = true; }
    });
    observeReveals(wrap);
    projectsRendered = true;

    if (finePointer && !reduced) {
      $$('.plate-stage', wrap).forEach(function (st) {
        st.addEventListener('pointermove', function (e) {
          var r = st.getBoundingClientRect();
          st.style.setProperty('--px', (((e.clientX - r.left) / r.width - 0.5) * -16).toFixed(1) + 'px');
          st.style.setProperty('--py', (((e.clientY - r.top) / r.height - 0.5) * -12).toFixed(1) + 'px');
        });
        st.addEventListener('pointerleave', function () { st.style.removeProperty('--px'); st.style.removeProperty('--py'); });
      });
    }
  }

  /* ------------------------------------------------------------------------
   * 9. نموذج التواصل (Formspree + احتياطي واتساب)
   * ---------------------------------------------------------------------- */
  var form = $('#contact-form');
  if (form) {
    var nameI = $('#client-name'), contactI = $('#client-contact'), msgI = $('#client-message');
    var typeS = $('#project-type'), submitBtn = $('#submit-btn'), alertBox = $('#form-alert');
    var fieldOf = function (i) { return i.closest('.field'); };

    function clearErrors() {
      [nameI, contactI, msgI].forEach(function (i) { fieldOf(i).classList.remove('has-error'); });
      alertBox.hidden = true; alertBox.textContent = '';
    }
    function flag(i) { fieldOf(i).classList.add('has-error'); }

    function showAlert(title, text, waUrl, waLabel) {
      alertBox.textContent = '';
      var s = D.createElement('strong'); s.textContent = title;
      var p = D.createElement('p'); p.textContent = text;
      alertBox.appendChild(s); alertBox.appendChild(p);
      if (waUrl) {
        var a = D.createElement('a'); a.href = waUrl; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.className = 'btn btn-sm';
        a.textContent = waLabel; alertBox.appendChild(a);
      }
      alertBox.hidden = false;
    }

    [nameI, contactI, msgI].forEach(function (i) {
      i.addEventListener('input', function () { fieldOf(i).classList.remove('has-error'); });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      clearErrors();

      var name = nameI.value.trim(), contact = contactI.value.trim(), msg = msgI.value.trim();
      var emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact);
      var phoneOk = contact.replace(/[\s\-()+]/g, '').length >= 8 && /^[0-9+\s\-()]+$/.test(contact);
      var bad = false;
      if (name.length < 2) { flag(nameI); bad = true; }
      if (!(emailOk || phoneOk)) { flag(contactI); bad = true; }
      if (msg.length < 8) { flag(msgI); bad = true; }
      if (bad) { var first = $('.has-error input, .has-error textarea', form); if (first) first.focus(); return; }

      var opt = typeS.options[typeS.selectedIndex];
      var typeName = typeS.value ? opt.textContent : tr('form.unknown');
      var waUrl = 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(tr('wa.msg', { name: name, contact: contact, type: typeName, msg: msg }));

      var label = $('.btn-label', submitBtn), original = label.textContent;
      submitBtn.disabled = true; label.textContent = tr('form.sending');

      fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } })
        .then(function (res) {
          if (!res.ok) throw new Error('formspree');
          showAlert(tr('form.ok.t', { name: name }), tr('form.ok.d'), waUrl, tr('form.ok.wa'));
          form.reset();
        })
        .catch(function () {
          showAlert(tr('form.fail.t', { name: name }), tr('form.fail.d'), waUrl, tr('form.fail.wa'));
        })
        .then(function () {
          submitBtn.disabled = false; label.textContent = original;
          label.textContent = (lang === 'en' && I.en['f.submit']) ? I.en['f.submit'] : label.dataset.ar || original;
        });
    });
  }

  /* ------------------------------------------------------------------------
   * 10. الأزرار العائمة: نخفي زر "نموذج التواصل" عند الوصول لقسم التواصل
   * ---------------------------------------------------------------------- */
  var contactSec = $('#contact'), fabForm = $('#fab-form');
  if (contactSec && fabForm && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { fabForm.classList.toggle('is-hidden', en.isIntersecting); });
    }, { threshold: 0.2 }).observe(contactSec);
  }

  /* ------------------------------------------------------------------------
   * تشغيل أولي
   * ---------------------------------------------------------------------- */
  applyLang(lang);          // يضبط النصوص + يرسم المشاريع
  observeReveals(D);
  onScroll();
  window.addEventListener('load', layoutSteps);
  if (D.fonts && D.fonts.ready) D.fonts.ready.then(layoutSteps);
})();
