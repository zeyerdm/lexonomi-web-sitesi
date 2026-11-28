(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fmt = n => n.toLocaleString('tr-TR');

  /* Menü: gece göğünü geçince açık zemine döner */
  const nav = $('#nav');
  const hero = $('.hero');
  const onScroll = () => {
    const y = window.scrollY, solid = y > (hero ? hero.offsetHeight - 160 : 40);
    nav.classList.toggle('solid', solid);
    nav.classList.toggle('dim', !solid && y > 20);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* Gamma video vitrin kontrolü */
  const gvVid = $('#gvVideo'), gvBtn = $('#gvToggle');
  if (gvVid && gvBtn) {
    gvBtn.addEventListener('click', () => {
      if (gvVid.paused) { gvVid.play(); gvBtn.textContent = 'Duraklat'; gvBtn.setAttribute('aria-pressed', 'false'); }
      else { gvVid.pause(); gvBtn.textContent = 'Oynat'; gvBtn.setAttribute('aria-pressed', 'true'); }
    });
  }

  /* Logoya tıklanınca kasmadan en başa dön */
  $$('.logo').forEach(l => l.addEventListener('click', e => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'instant' });
  }));

  /* Mobil menü */
  const burger = $('#burger'), mnav = $('#mnav');
  const setMenu = open => { burger.setAttribute('aria-expanded', open); mnav.hidden = !open; nav.classList.toggle('solid', open || window.scrollY > 40); };
  burger.addEventListener('click', () => setMenu(mnav.hidden));
  $$('a', mnav).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* Görünme animasyonu */
  const io = 'IntersectionObserver' in window && !rm ? new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: 0.12 }) : null;
  $$('.reveal').forEach(el => io ? io.observe(el) : el.classList.add('in'));

  /* Harf harf yazma */
  const typeInto = (el, text, speed = 32, done) => {
    if (rm) { el.textContent = text; done && done(); return; }
    el.textContent = ''; el.classList.add('typing', 'is-typing');
    let i = 0;
    const step = () => {
      i++; el.textContent = text.slice(0, i);
      if (i < text.length) setTimeout(step, speed + Math.random() * 25);
      else setTimeout(() => { el.classList.remove('is-typing', 'typing'); done && done(); }, 400);
    };
    step();
  };

  /* Giriş penceresi: soru yazılır, sonuçlar belirir */
  const heroWin = $('.hero-win'), hq = $('#heroQuery');
  if (heroWin && hq) {
    if (rm) heroWin.classList.add('shown');
    else {
      setTimeout(() => typeInto(hq, hq.dataset.text, 28, () => heroWin.classList.add('shown')), 700);
      setTimeout(() => heroWin.classList.add('shown'), 1800); // sonuçlar yazım bitmeden de görünür
    }
  }

  /* Künye penceresi: karar no görünür olunca yazılır */
  $$('.typing[data-text]').forEach(el => {
    if (!('IntersectionObserver' in window) || rm) return;
    const t = el.dataset.text; el.textContent = '';
    const o = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { o.disconnect(); setTimeout(() => typeInto(el, t, 90), 300); }
    }), { threshold: 0.8 });
    o.observe(el);
  });

  /* Sayılar sayarak artar */
  if ('IntersectionObserver' in window && !rm) {
    const co = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return; co.unobserve(e.target);
      const el = e.target, target = +el.dataset.count, t0 = performance.now();
      const tick = now => { const k = Math.min(1, (now - t0) / 1200); el.textContent = Math.round(target * (1 - Math.pow(1 - k, 3))); if (k < 1) requestAnimationFrame(tick); };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    $$('[data-count]').forEach(el => { el.textContent = '0'; co.observe(el); });
  }

  /* Kaynak Arama: sıralama sekmeleri */
  const list = $('#sortList');
  if (list) {
    const items = [...list.children];
    const years = items.map(li => +(li.querySelector('span').textContent.match(/(\d{4})\s*$/) || [0, 0])[1]);
    $$('[data-sort]').forEach(tab => tab.addEventListener('click', () => {
      $$('[data-sort]').forEach(t => t.classList.toggle('on', t === tab));
      let order = items.map((li, i) => i);
      if (tab.dataset.sort === 'guncel') order.sort((a, b) => years[b] - years[a]);
      if (tab.dataset.sort === 'kelime') order = [1, 0, 2];
      order.forEach(i => list.appendChild(items[i]));
    }));
  }

  /* Meslek grupları sekmeleri */
  $$('[data-meslek]').forEach(btn => btn.addEventListener('click', () => {
    const k = btn.dataset.meslek;
    $$('[data-meslek]').forEach(b => { b.classList.toggle('on', b === btn); b.setAttribute('aria-selected', b === btn); });
    $$('[data-meslek-pane]').forEach(p => { p.hidden = p.dataset.meslekPane !== k; });
  }));

  /* Belge: öneriyi metne işle */
  const sug = $('#suggest'), ab = $('#applyBtn');
  if (sug && ab) ab.addEventListener('click', () => {
    const on = sug.classList.toggle('done');
    ab.textContent = on ? 'İşlendi ✓' : 'Metne işle';
  });

  /* Hesap Paneli: 4 hesaplayıcı + 4 hesap sekmesi */
  $$('[data-calc]').forEach(b => b.addEventListener('click', () => {
    $$('[data-calc]').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
    $$('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== b.dataset.calc; });
  }));

  const aIn = $('#aautIn'), aKab = $('#aautKabul'), aR = $('#aautRange'), aSon = $('#aautSonuc'), aTar = $('#aautTarife');
  if (aIn && aR) {
    const brackets = [[800000, .16], [800000, .15], [1600000, .14], [2400000, .11], [3200000, .08], [4000000, .05], [4800000, .03], [Infinity, .02]];
    const calc = () => {
      const val = +aIn.value.replace(/\D/g, '') || 0;
      const kab = aKab ? (+aKab.value.replace(/\D/g, '') || 0) : 0;
      const base = kab > 0 ? Math.min(kab, val || kab) : val;
      const maktu = aTar ? (+aTar.value || 62000) : 62000;
      if (aSon && aSon.value === 'maktu') {
        $('#aautOut').textContent = maktu.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
        $('#aautBd').textContent = `Maktu tarife (${fmt(maktu)} TL)`;
        return;
      }
      let r = base, t = 0; const parts = [];
      brackets.forEach(([c, p], i) => {
        if (r <= 0) return;
        const part = Math.min(r, c);
        parts.push(`${i === 0 ? 'İlk' : (r <= c ? 'kalan' : 'sonraki')} ${fmt(part)} × %${Math.round(p * 100)}`);
        t += part * p; r -= c;
      });
      if (aSon && aSon.value === '0.5') t *= 0.5;
      const out = (!aSon || aSon.value === '1') ? Math.max(t, maktu) : Math.max(t, maktu * 0.5);
      $('#aautOut').textContent = out.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
      $('#aautBd').textContent = t < maktu ? `Maktu alt sınır: ${fmt(maktu)} TL` : parts.slice(0, 4).join(' · ') + (parts.length > 4 ? ' …' : '');
    };
    aIn.addEventListener('input', () => { const v = +aIn.value.replace(/\D/g, '') || 0; aIn.value = v ? fmt(v) : ''; aR.value = Math.min(v, 15000000); calc(); });
    if (aKab) aKab.addEventListener('input', () => { const v = +aKab.value.replace(/\D/g, '') || 0; aKab.value = v ? fmt(v) : ''; calc(); });
    aR.addEventListener('input', () => { aIn.value = fmt(+aR.value); calc(); });
    [aTar, aSon].filter(Boolean).forEach(el => el.addEventListener('change', calc));
    calc();
  }

  const calcFaiz = () => {
    const ana = +($('#faizAna') ? $('#faizAna').value.replace(/\D/g, '') : 0) || 0;
    const b1 = new Date(($('#faizBas')?.value || '2024-01-01') + 'T12:00:00');
    const b2 = new Date(($('#faizBit')?.value || '2024-12-31') + 'T12:00:00');
    const days = Math.max(1, Math.round((b2 - b1) / 86400000));
    const faiz = ana * 0.1775343 * (days / 365);
    if ($('#faizOut')) $('#faizOut').textContent = (ana + faiz).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
    if ($('#faizBreakdown')) $('#faizBreakdown').textContent = `Anapara ${fmt(ana)} TL + faiz ${faiz.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL (${days} gün) · 3095 s.K. m.1`;
  };
  ['#faizAna', '#faizBas', '#faizBit'].forEach(s => $(s) && $(s).addEventListener('input', calcFaiz));

  const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
  const calcSure = () => {
    const d = new Date(($('#sureTarih')?.value || '') + 'T12:00:00');
    if (isNaN(d)) return;
    d.setDate(d.getDate() + (+$('#sureGun').value || 14));
    while (d.getDay() === 0 || d.getDay() === 6) d.setDate(d.getDate() + 1);
    $('#sureOut').textContent = `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()} ${gunler[d.getDay()]}`;
  };
  ['#sureTarih', '#sureGun'].forEach(s => $(s) && $(s).addEventListener('change', calcSure));

  if ($('#harcDeger')) {
    $('#harcDeger').addEventListener('input', e => {
      const v = +e.target.value.replace(/\D/g, '') || 0;
      e.target.value = v ? fmt(v) : '';
      $('#harcOut').textContent = ((v * 0.06831) / 4).toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';
    });
  }

  if ($('#accountCard')) {
    const plans = {
      temel: { name: 'Temel', usage: [['Arama', 1840, 4500], ['Araştırma', 14, 30]], inv: [['Temel · Kasım 2026', '1.500 TL']] },
      uzman: { name: 'Uzman', usage: [['Arama', 3920, 7500], ['Araştırma', 112, 250], ['Belge', 19, 30]], inv: [['Uzman · Kasım 2026', '3.500 TL']] },
      pro: { name: 'Profesyonel', usage: [['Arama', 6412, 15000], ['Araştırma', 318, 1000], ['Belge', 141, 150]], inv: [['Profesyonel · Kasım 2026', '5.000 TL'], ['Uzman · Ekim 2026', '3.500 TL']] }
    };
    const renderP = k => {
      const p = plans[k] || plans.pro;
      $('#accTierBadge').textContent = p.name;
      $('#accPlanName').textContent = p.name;
      $('#accUsageList').innerHTML = p.usage.map(([l, u, m]) => `<div class="usage-row"><div class="usage-top"><span>${l}</span><b>${fmt(u)} / ${fmt(m)}</b></div><div class="usage-bar"><i style="width:${Math.min(100, Math.round((u / m) * 100))}%"></i></div><span class="usage-foot">${fmt(m - u)} kaldı</span></div>`).join('');
      $('#accInvoiceList').innerHTML = p.inv.map(([d, t]) => `<li><b>${d}</b><span>${t} · PDF</span></li>`).join('');
      $$('[data-switch-plan]').forEach(b => b.classList.toggle('is-on', b.dataset.switchPlan === k));
    };
    $$('[data-acc]').forEach(b => b.addEventListener('click', () => {
      $$('[data-acc]').forEach(x => x.classList.toggle('is-on', x === b));
      $$('[data-acc-pane]').forEach(p => { p.hidden = p.dataset.accPane !== b.dataset.acc; });
    }));
    $$('[data-switch-plan]').forEach(b => b.addEventListener('click', () => renderP(b.dataset.switchPlan)));
    renderP('pro');
  }

  /* Paketler: aylık / yıllık */
  $$('[data-bill]').forEach(b => b.addEventListener('click', () => {
    const y = b.dataset.bill === 'y';
    $$('[data-bill]').forEach(x => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    $$('.price [data-m]').forEach(el => { el.textContent = y ? el.dataset.y : el.dataset.m; });
  }));

  /* SSS: tek açık */
  $$('.faq details').forEach(d => d.addEventListener('toggle', () => { if (d.open) $$('.faq details').forEach(o => { if (o !== d) o.open = false; }); }));

  const yr = $('#yr'); if (yr) yr.textContent = new Date().getFullYear();
})();
