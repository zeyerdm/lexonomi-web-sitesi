(() => {
  'use strict';
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const fmt = n => n.toLocaleString('tr-TR');
  const tl = n => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + ' TL';

  /* Toast & kopyala */
  let tmr;
  const toast = msg => {
    const el = $('#toast');
    if (!el) return;
    el.textContent = msg;
    el.hidden = false;
    clearTimeout(tmr);
    tmr = setTimeout(() => { el.hidden = true; }, 2200);
  };
  const copy = async txt => {
    try { await navigator.clipboard.writeText(txt); } catch { }
    toast('Künyesiyle kopyalandı.');
  };

  $$('[data-copy]').forEach(b => b.addEventListener('click', () => copy(b.dataset.copy)));
  $$('[data-toast-msg]').forEach(b => b.addEventListener('click', () => toast(b.dataset.toastMsg)));
  $$('[data-demo-auth]').forEach(a => a.addEventListener('click', e => { e.preventDefault(); toast(a.dataset.demoAuth); }));
  /* Giriş / kayıt bağlantıları: adresler hero-media.js içindeki LEXONOMI_LINKS'ten gelir */
  const links = window.LEXONOMI_LINKS || {};
  $$('[data-app-link]').forEach(a => {
    const u = links[a.dataset.appLink];
    if (!u) return;
    a.href = a.dataset.selectPlan ? `${u}${u.includes('?') ? '&' : '?'}paket=${a.dataset.selectPlan}` : u;
  });

  /* Sosyal medya bağlantıları */
  const social = window.LEXONOMI_SOCIAL || {};
  $$('[data-social]').forEach(a => {
    const u = social[a.dataset.social];
    if (u) a.href = u;
  });

  /* Logoya tıklanınca ana sayfa başına kasmadan anında dön */
  $$('a.brand').forEach(b => b.addEventListener('click', e => {
    const href = b.getAttribute('href') || '';
    if (href === '#top' || href === 'index.html' || href === './') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'instant' });
      if (window.location.hash) history.replaceState(null, '', window.location.pathname + window.location.search);
    }
  }));

  /* Mobil menü */
  const menuBtn = $('#menuBtn'), menu = $('#mobileMenu');
  if (menuBtn && menu) {
    const setMenu = open => { menuBtn.setAttribute('aria-expanded', open); menu.hidden = !open; };
    menuBtn.addEventListener('click', () => setMenu(menu.hidden));
    $$('a', menu).forEach(a => a.addEventListener('click', () => setMenu(false)));
  }

  /* Çerez bildirimi */
  const cookieBar = $('#cookieBar'), cookieAccept = $('#cookieAccept');
  if (cookieBar && cookieAccept) {
    try { if (!localStorage.getItem('lx_cookie_ok')) cookieBar.hidden = false; } catch { cookieBar.hidden = false; }
    cookieAccept.addEventListener('click', () => {
      cookieBar.hidden = true;
      try { localStorage.setItem('lx_cookie_ok', '1'); } catch { }
    });
  }

  /* Hafif scroll reveal */
  const reveals = $$('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { threshold: 0.05 });
    reveals.forEach(el => io.observe(el));
  }

  /* 1. SİNEMATİK GİRİŞ VİDEOSU & MERKEZİ MEDYA YÖNETİMİ */
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const heroVideo = $('#heroVideo'), mediaBtn = $('#heroMediaToggle'), mediaBtnTxt = $('#heroMediaToggleText');
  const heroTitle = $('#heroSlogan');
  if (heroVideo && window.LEXONOMI_HERO_MEDIA) {
    const cfg = window.LEXONOMI_HERO_MEDIA;
    if (cfg.poster) heroVideo.poster = cfg.poster;
    if (cfg.slogan && heroTitle) heroTitle.textContent = cfg.slogan;
    if ($('#heroSampleNote')) $('#heroSampleNote').textContent = cfg.sampleLabel || '';

    const addSrc = (src, type) => {
      if (!src) return;
      const s = document.createElement('source');
      s.src = src; s.type = type;
      heroVideo.appendChild(s);
    };
    addSrc(cfg.videoWebm, 'video/webm');
    addSrc(cfg.videoMp4, 'video/mp4');
    heroVideo.load();

    const setPausedState = paused => {
      if (!mediaBtn) return;
      mediaBtn.setAttribute('aria-pressed', paused);
      mediaBtn.setAttribute('aria-label', paused ? 'Videoyu oynat' : 'Videoyu duraklat');
      if (mediaBtnTxt) mediaBtnTxt.textContent = paused ? 'Oynat' : 'Duraklat';
    };

    if (reduceMotion) {
      heroVideo.removeAttribute('autoplay');
      heroVideo.pause();
      setPausedState(true);
    } else {
      heroVideo.muted = true;
      heroVideo.play().then(() => setPausedState(false)).catch(() => setPausedState(true));
    }
    heroVideo.addEventListener('playing', () => setPausedState(false));

    if (mediaBtn) {
      mediaBtn.addEventListener('click', () => {
        if (heroVideo.paused) {
          heroVideo.play().then(() => setPausedState(false)).catch(() => setPausedState(true));
        } else {
          heroVideo.pause();
          setPausedState(true);
        }
      });
    }
  }

  /* Başlığı kelime kelime belirt */
  if (heroTitle && !reduceMotion) {
    const words = heroTitle.textContent.trim().split(/\s+/);
    heroTitle.setAttribute('aria-label', heroTitle.textContent.trim());
    heroTitle.innerHTML = words.map((w, i) => `<span class="w" style="--i:${i}" aria-hidden="true">${w}</span>`).join(' ');
  }

  /* Kapsam cümlesi: kelimeler kaydırdıkça koyulaşır */
  const emStatement = $('.em-statement');
  let emWords = [];
  if (emStatement && !reduceMotion) {
    const txt = emStatement.textContent.trim().replace(/\s+/g, ' ');
    emStatement.setAttribute('aria-label', txt);
    emStatement.innerHTML = txt.split(' ').map(w => `<span class="sw" aria-hidden="true">${w}</span>`).join(' ');
    emWords = $$('.sw', emStatement);
  }

  /* Sayılar görünür olunca sayarak artar (11M+, 8, 14 …) */
  const counters = $$('.em-row strong');
  if (counters.length && !reduceMotion && 'IntersectionObserver' in window) {
    counters.forEach(el => {
      const m = el.textContent.trim().match(/^(\d+)(.*)$/);
      if (!m) return;
      el.dataset.target = m[1];
      el.dataset.suffix = m[2];
      el.textContent = '0' + m[2];
    });
    const cio = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      const el = e.target, target = +el.dataset.target, suffix = el.dataset.suffix || '';
      if (!target) return;
      const t0 = performance.now(), dur = 1400;
      const tick = now => {
        const k = Math.min(1, (now - t0) / dur), eased = 1 - Math.pow(1 - k, 3);
        el.textContent = Math.round(target * eased) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }), { threshold: 0.6 });
    counters.forEach(el => el.dataset.target && cio.observe(el));
  }

  /* Kaydırma motoru: giriş çerçevesi, katman yığını, okuma çubuğu */
  const header = $('.site-header');
  const heroSec = $('.hero-cine');
  const stackSec = $('.stack-sec');
  const plates = $$('[data-plate]');
  const tiles = $$('.plate-tiles i');
  const caps = $$('[data-cap]');
  const steps = $$('.stack-progress [data-step]');
  const clamp01 = v => Math.max(0, Math.min(1, v));
  let ticking = false, lastCap = -1;

  const onScroll = () => {
    ticking = false;
    const y = window.scrollY, vh = window.innerHeight;

    if (heroSec) {
      const run = heroSec.offsetHeight - vh;
      const p = run > 0 ? clamp01((y - heroSec.offsetTop) / run) : 0;
      heroSec.style.setProperty('--p', p.toFixed(4));
      heroSec.style.setProperty('--p2', clamp01((p - .45) / .4).toFixed(4));
      if (header) header.classList.toggle('on-hero', p < 0.12);
    }

    if (stackSec && plates.length) {
      const top = stackSec.getBoundingClientRect().top + y;
      const run = stackSec.offsetHeight - vh;
      const sp = run > 0 ? clamp01((y - top) / run) : 0;
      stackSec.style.setProperty('--sp', sp.toFixed(4));
      const n = plates.length;
      let current = 0;
      plates.forEach((pl, i) => {
        const start = i / n * 0.92, t = clamp01((sp - start) / (0.6 / n));
        const e = 1 - Math.pow(1 - t, 3);
        pl.style.setProperty('--t', e.toFixed(4));
        if (t > 0.5) current = i;
      });
      plates.forEach((pl, i) => pl.classList.toggle('is-current', i === current && sp < 0.995));
      const tilesT = clamp01((sp - 0.86) / 0.12);
      tiles.forEach((tl, i) => tl.style.setProperty('--tt', clamp01(tilesT * tiles.length - i * 0.6).toFixed(3)));
      if (current !== lastCap) {
        lastCap = current;
        caps.forEach(c => c.classList.toggle('is-active', +c.dataset.cap === current));
        steps.forEach(s => s.classList.toggle('on', +s.dataset.step <= current));
      }
    }

    if (emWords.length) {
      const r = emStatement.getBoundingClientRect();
      const k = clamp01((vh * 0.85 - r.top) / (vh * 0.5));
      const lit = Math.round(k * emWords.length);
      emWords.forEach((w, i) => w.classList.toggle('on', i < lit));
    }
  };
  const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } };
  window.addEventListener('scroll', requestTick, { passive: true });
  window.addEventListener('resize', requestTick);
  onScroll();

  /* 2. MODÜL SEKMELERİ */
  const activateMod = key => {
    const target = $(`[data-mod="${key}"]`);
    if (!target) return;
    $$('[data-mod]').forEach(x => { x.classList.toggle('is-on', x === target); x.setAttribute('aria-selected', x === target); });
    $$('[data-mod-pane]').forEach(p => { p.hidden = p.dataset.modPane !== key; });
  };
  $$('[data-mod]').forEach(btn => btn.addEventListener('click', () => activateMod(btn.dataset.mod)));
  try {
    const modParam = new URLSearchParams(window.location.search).get('mod');
    if (modParam) activateMod(modParam);
  } catch { }

  /* Kaynak Arama önizleme */
  if ($('#kaynakList')) {
    const data = [
      { court: 'Danıştay 3. D.', meta: 'E.2020/1142 K.2022/2355', year: 2022, score: 96, kw: 2, text: '213 s. VUK m.353 uyarınca ceza için <mark>usulüne uygun somut tespit</mark> zorunludur.' },
      { court: 'Danıştay 7. D.', meta: 'E.2021/4789 K.2023/396', year: 2023, score: 91, kw: 4, text: 'Özel usulsüzlük cezasında <mark>her belge için ayrı tespit</mark> ve <mark>somut dayanak</mark> aranır.' },
      { court: 'Danıştay VDDK', meta: 'E.2023/9 K.2024/534', year: 2024, score: 85, kw: 3, text: 'Mal teslimi kanıtlanmadan <mark>varsayıma dayalı ceza</mark> tesis edilemez.' }
    ];
    let cur = data[0];
    const showK = it => {
      cur = it;
      $('#kaynakCourt').textContent = it.court;
      $('#kaynakMeta').textContent = it.meta;
      const term = ($('#kaynakInSearch').value || '').trim();
      let html = `<p>${it.text}</p>`;
      if (term.length >= 2) html = html.replace(new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'), '<mark>$1</mark>');
      $('#kaynakText').innerHTML = html;
    };
    const renderK = sort => {
      const items = [...data];
      if (sort === 'guncel') items.sort((a, b) => b.year - a.year);
      else if (sort === 'kelime') items.sort((a, b) => b.kw - a.kw);
      else items.sort((a, b) => b.score - a.score);
      const ul = $('#kaynakList');
      ul.innerHTML = '';
      items.forEach((it, i) => {
        const li = document.createElement('li');
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'app-result-item' + (i === 0 ? ' is-selected' : '');
        const badge = sort === 'guncel' ? it.year : sort === 'kelime' ? `${it.kw} eşleşme` : `%${it.score}`;
        b.innerHTML = `<div><b>${it.court}</b><small>${it.meta}</small></div><span>${badge}</span>`;
        b.addEventListener('click', () => { $$('.app-result-item', ul).forEach(x => x.classList.remove('is-selected')); b.classList.add('is-selected'); showK(it); });
        li.appendChild(b); ul.appendChild(li);
      });
      showK(items[0]);
    };
    $$('#kaynakSortTabs button').forEach(b => b.addEventListener('click', () => {
      $$('#kaynakSortTabs button').forEach(x => x.classList.toggle('is-on', x === b));
      renderK(b.dataset.ksort);
    }));
    $('#kaynakInSearch').addEventListener('input', () => showK(cur));
    renderK('ilgi');
  }

  /* Hukuki Araştırma atıf önizleme */
  const cites = {
    c1: { title: 'Danıştay 4. Dairesi', meta: 'E.2020/153 K.2023/4414 · T.21.06.2023', text: 'Fatura veya makbuzların verilmemesi halinde fiilin somut delillerle kanıtlanması aranır.' },
    c2: { title: 'Danıştay 3. Dairesi', meta: 'E.2020/4162 K.2022/3492 · T.03.10.2022', text: 'Belgenin verilmediğinin açıkça tespiti halinde zamanaşımı süresi içinde hesap dönemi kapandıktan sonra da ceza kesilebilir.' }
  };
  $$('.cite-link').forEach(b => b.addEventListener('click', () => {
    const c = cites[b.dataset.cite];
    if (!c) return;
    $('#citeDrawerTitle').textContent = c.title;
    $('#citeDrawerMeta').textContent = c.meta;
    $('#citeDrawerText').textContent = c.text;
  }));

  /* Belge Geliştirme */
  if ($('#belgeCanvas')) {
    let mode = 'uret';
    const applied = new Set();
    const renderB = () => {
      const el = $('#belgeCanvas');
      if (mode === 'uret') {
        el.innerHTML = `<p><b>[YER] İŞ MAHKEMESİNE</b></p><p>İşveren olayı 03.03.2026'da öğrenmiş, 20.03.2026'da fesih yapmıştır. <mark>Altı iş günlük hak düşürücü süre dolmuştur</mark> (Yargıtay 22. HD, E.2017/14204 K.2018/17477).</p>`;
      } else if (mode === 'iyilestir') {
        const on = applied.has('s1');
        el.innerHTML = `<div class="suggestion-card${on ? ' is-applied' : ''}"><div class="suggestion-head"><b>Öneri · İhbar tazminatı faiz başlangıcı</b><button type="button" class="copy-btn" id="applySugBtn">${on ? 'Onaylandı ✓' : 'Metne İşle'}</button></div><p style="margin:0">Dava veya temerrüt tarihinden yasal faiz istenmesi içtihatla uyumludur.</p></div><div class="risk-box"><b>Hukuki Risk Notu:</b> Öğrenme tarihinin feshe yetkili organca gerçekleştiği kayıtlarla desteklenmelidir.</div>`;
        $('#applySugBtn').addEventListener('click', () => { if (on) applied.delete('s1'); else applied.add('s1'); renderB(); });
      } else if (mode === 'atif') {
        el.innerHTML = `<p><b>Atıf yapılan kararlar (2):</b></p><p>1. <b>Yargıtay 22. HD · E.2017/14204 K.2018/17477 (T.11.07.2018)</b> — Altı iş günlük hak düşürücü süre taraflarca ileri sürülmese dahi hâkimce resen dikkate alınır.</p><p>2. <b>Yargıtay 9. HD · E.2023/9430 K.2023/8075</b> — Tüzel kişi işverende 6 iş günü, feshe yetkili merciin öğrenme gününden başlar.</p>`;
      } else {
        el.innerHTML = `<p><b>OCR Dönüştürme:</b> <code>taranmis-rapor.pdf</code> (4 sayfa) → <mark>1.420 kelime</mark> düzenlenebilir metne çevrildi.</p>`;
      }
    };
    $$('#belgeModeTabs button').forEach(b => b.addEventListener('click', () => {
      mode = b.dataset.bmode;
      $$('#belgeModeTabs button').forEach(x => x.classList.toggle('is-on', x === b));
      renderB();
    }));
    renderB();
  }

  /* 2.5. OMURGA RADYAL KAYNAK AĞI (36 KAYNAK) */
  const bbSvg = $('#backboneSvg');
  if (bbSvg) {
    const cx = 600, cy = 320, count = 42;
    let markup = '';
    for (let i = 0; i < count; i++) {
      const a = Math.PI * (0.08 + (0.84 * i) / (count - 1));
      const r = 165 + ((i * 53) % 105);
      const x = (cx + Math.cos(a) * r * 1.9).toFixed(1);
      const y = (cy - Math.sin(a) * r).toFixed(1);
      const gold = i % 5 === 0;
      markup += `<line x1="${cx}" y1="${cy}" x2="${x}" y2="${y}" class="bb-ray${gold ? ' bb-ray-gold' : ''}"/><circle cx="${x}" cy="${y}" r="${gold ? 2.6 : 2}" class="bb-dot${gold ? ' bb-dot-gold' : ''}"/>`;
    }
    bbSvg.innerHTML = markup;
  }

  /* 3. HESAP PANELİ */
  if ($('#aautInput')) {
    $$('[data-calc]').forEach(b => b.addEventListener('click', () => {
      $$('[data-calc]').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-selected', x === b); });
      $$('[data-pane]').forEach(p => { p.hidden = p.dataset.pane !== b.dataset.calc; });
    }));
    const brackets = [[800000, .16], [800000, .15], [1600000, .14], [2400000, .11], [3200000, .08], [4000000, .05], [4800000, .03], [Infinity, .02]];
    const aIn = $('#aautInput'), aKab = $('#aautKabul'), aRng = $('#aautRange'), aTar = $('#aautTarife'), aSon = $('#aautSonuc');
    const calcAAUT = () => {
      const val = +aIn.value.replace(/\D/g, '') || 0;
      const kabRaw = aKab ? (+aKab.value.replace(/\D/g, '') || 0) : 0;
      const base = kabRaw > 0 ? Math.min(kabRaw, val || kabRaw) : val;
      const maktu = +aTar.value || 62000;
      if (aSon.value === 'maktu') {
        $('#aautOut').textContent = tl(maktu);
        $('#aautBreakdown').textContent = `Maktu tarife (${fmt(maktu)} TL)`;
        return;
      }
      let r = base, t = 0;
      const parts = [];
      brackets.forEach(([c, p], i) => {
        if (r <= 0) return;
        const part = Math.min(r, c);
        const label = i === 0 ? 'İlk' : (r <= c ? 'kalan' : 'sonraki');
        parts.push(`${label} ${fmt(part)} × %${Math.round(p * 100)} = ${fmt(Math.round(part * p))}`);
        t += part * p; r -= c;
      });
      if (aSon.value === '0.5') t *= 0.5;
      const out = aSon.value === '1' ? Math.max(t, maktu) : Math.max(t, maktu * 0.5);
      $('#aautOut').textContent = tl(out);
      $('#aautBreakdown').textContent = `${parts.join(' · ')} · Dayanak · AAÜT m.13 · 3. Kısım (maktu ${fmt(maktu)} TL'den az olamaz)`;
    };
    aIn.addEventListener('input', () => { const v = +aIn.value.replace(/\D/g, '') || 0; aIn.value = v ? fmt(v) : ''; aRng.value = Math.min(v, 15000000); calcAAUT(); });
    if (aKab) aKab.addEventListener('input', () => { const v = +aKab.value.replace(/\D/g, '') || 0; aKab.value = v ? fmt(v) : ''; calcAAUT(); });
    aRng.addEventListener('input', () => { aIn.value = fmt(+aRng.value); calcAAUT(); });
    [aTar, aSon].forEach(el => el.addEventListener('change', calcAAUT));
    calcAAUT();

    /* Adi kanuni faiz (3095 s.K. m.1): 01.06.2024'e kadar %9, sonrası %24 (CB Kararı 8485) */
    const faizDonem = [['2006-01-01', '2024-05-31', 9], ['2024-06-01', '2099-12-31', 24]];
    const DAY = 864e5;
    const dt = s => new Date(s + 'T00:00:00Z');
    const dmy = d => `${String(d.getUTCDate()).padStart(2, '0')}.${String(d.getUTCMonth() + 1).padStart(2, '0')}.${d.getUTCFullYear()}`;
    const tl2 = n => n.toLocaleString('tr-TR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    const calcFaiz = () => {
      const a = +$('#faizAna').value.replace(/\D/g, '') || 0;
      const bas = dt($('#faizBas').value), bit = dt($('#faizBit').value);
      if (isNaN(bas) || isNaN(bit) || bit <= bas) return;
      let toplam = 0, gun = 0;
      const parts = [];
      faizDonem.forEach(([s, e, o]) => {
        const from = new Date(Math.max(bas, dt(s)));
        const to = new Date(Math.min(bit - DAY, +dt(e)));
        if (to < from) return;
        const n = Math.round((to - from) / DAY) + 1;
        const f = Math.round(a * o / 100 * n / 365 * 100) / 100;
        toplam += f; gun += n;
        parts.push(`${dmy(from).slice(0, 5)}–${dmy(to)} %${o} = ${tl2(f)}`);
      });
      $('#faizOut').textContent = tl(a + toplam);
      $('#faizBreakdown').textContent = `Anapara ${tl2(a)} + faiz ${tl2(toplam)} (${gun} gün): ${parts.join(' · ')} · Dayanak · 3095 s.K. m.1 · CB Kararı 8485 (RG 21.05.2024/32552)`;
    };
    $('#faizAna').addEventListener('input', e => { const v = +e.target.value.replace(/\D/g, '') || 0; e.target.value = v ? fmt(v) : ''; calcFaiz(); });
    ['#faizBas', '#faizBit'].forEach(s => $(s).addEventListener('change', calcFaiz));

    const gunler = ['Pazar', 'Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi'];
    const sabitTatil = ['01-01', '04-23', '05-01', '05-19', '07-15', '08-30', '10-29'];
    const fmtD = d => `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}.${d.getFullYear()}`;
    const isTatil = d => d.getDay() === 0 || d.getDay() === 6 ||
      sabitTatil.includes(`${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
    const calcSure = () => {
      const d = new Date($('#sureTarih').value + 'T12:00:00');
      if (isNaN(d)) return;
      const opt = $('#sureGun').selectedOptions[0];
      const gunSay = +opt.value || 14;
      d.setDate(d.getDate() + gunSay);
      const notes = [`${gunSay / 7} hafta → ${fmtD(d)}`];
      const y = d.getFullYear(), tatilBas = new Date(y, 6, 20, 12), tatilBit = new Date(y, 7, 31, 12);
      if (d >= tatilBas && d <= tatilBit) {
        d.setTime(tatilBit.getTime());
        d.setDate(d.getDate() + 7);
        notes[0] += ` adli tatilde; tatilin bittiği 31 Ağustos'tan itibaren bir hafta uzar (HMK m.104)`;
      }
      let kaydi = false;
      while (isTatil(d)) { d.setDate(d.getDate() + 1); kaydi = true; }
      if (kaydi) notes.push('tatile rastladığı için izleyen ilk iş gününe kayar (HMK m.93)');
      $('#sureOut').textContent = `${fmtD(d)} ${gunler[d.getDay()]}`;
      $('#sureBreakdown').textContent = `${notes.join('; ')}. · Dayanak · ${opt.dataset.dayanak || 'HMK'}`;
    };
    ['#sureTarih', '#sureGun'].forEach(s => $(s).addEventListener('change', calcSure));
    $('#harcDeger').addEventListener('input', e => { const v = +e.target.value.replace(/\D/g, '') || 0; e.target.value = v ? fmt(v) : ''; $('#harcOut').textContent = tl((v * 0.06831) / 4); if ($('#harcBreakdown')) $('#harcBreakdown').textContent = `${fmt(v)} × binde 68,31 ÷ 4 · Dayanak · 492 s. Harçlar Kanunu`; });
  }

  if ($('#accountCard')) {
    const plans = {
      temel: { name: 'Temel', usage: [['Arama', 1840, 4500], ['Araştırma', 14, 30]], inv: [['Temel · Kasım 2026', '1.500 TL']] },
      uzman: { name: 'Uzman', usage: [['Arama', 3920, 7500], ['Araştırma', 112, 250], ['Belge', 19, 30]], inv: [['Uzman · Kasım 2026', '3.500 TL']] },
      pro: { name: 'Profesyonel', usage: [['Arama', 6412, 15000], ['Araştırma', 318, 1000], ['Belge', 141, 150]], inv: [['Profesyonel · Kasım 2026', '5.000 TL'], ['Uzman · Ekim 2026', '3.500 TL']] }
    };
    const renderP = (k, selectCard = false) => {
      const p = plans[k] || plans.pro;
      $('#accountCard').dataset.tier = k;
      if ($('#accTierBadge')) $('#accTierBadge').textContent = p.name;
      $('#accPlanName').textContent = p.name;
      $('#accUsageList').innerHTML = p.usage.map(([lbl, u, m]) => `<div class="usage-row"><div class="usage-top"><span>${lbl}</span><b>${fmt(u)} / ${fmt(m)}</b></div><div class="usage-bar"><i style="width:${Math.min(100, Math.round((u / m) * 100))}%"></i></div><span class="usage-foot">${fmt(m - u)} kaldı</span></div>`).join('');
      $('#accInvoiceList').innerHTML = p.inv.map(([d, t]) => `<li><b>${d}</b><span>${t} · PDF</span></li>`).join('');
      $$('[data-switch-plan]').forEach(b => b.classList.toggle('is-on', b.dataset.switchPlan === k));
      if (selectCard) {
        $$('.plan[data-tier]').forEach(card => card.classList.toggle('is-selected', card.dataset.tier === k));
      }
    };
    $$('[data-acc]').forEach(b => b.addEventListener('click', () => {
      $$('[data-acc]').forEach(x => x.classList.toggle('is-on', x === b));
      $$('[data-acc-pane]').forEach(p => { p.hidden = p.dataset.accPane !== b.dataset.acc; });
    }));
    $$('[data-switch-plan]').forEach(b => b.addEventListener('click', () => renderP(b.dataset.switchPlan, false)));
    renderP('pro', false);
  }

  /* Blog filtreleme (blog/index.html) */
  if ($('#blogList')) {
    let activeCat = 'tumu';
    const searchEl = $('#blogSearch'), cards = $$('.blog-card', $('#blogList')), emptyEl = $('#blogEmpty');
    const filterBlog = () => {
      const q = (searchEl ? searchEl.value : '').toLocaleLowerCase('tr-TR').trim();
      let shown = 0;
      cards.forEach(c => {
        const vis = (activeCat === 'tumu' || c.dataset.cat === activeCat) && (!q || c.textContent.toLocaleLowerCase('tr-TR').includes(q));
        c.hidden = !vis; if (vis) shown++;
      });
      if (emptyEl) emptyEl.hidden = shown > 0;
    };
    $$('[data-blog-cat]').forEach(b => b.addEventListener('click', () => {
      activeCat = b.dataset.blogCat;
      $$('[data-blog-cat]').forEach(x => x.classList.toggle('is-on', x === b));
      filterBlog();
    }));
    if (searchEl) searchEl.addEventListener('input', filterBlog);
    cards.forEach(c => {
      const link = $('a.blog-more, h3 a', c);
      if (!link) return;
      c.addEventListener('click', e => {
        if (e.target.closest('a')) return;
        window.location.href = link.getAttribute('href');
      });
    });
  }

  /* Paket dönemi, SSS & yıl */
  $$('.billing button').forEach(b => b.addEventListener('click', () => {
    const y = b.dataset.billing === 'yearly';
    $$('.billing button').forEach(x => { x.classList.toggle('is-on', x === b); x.setAttribute('aria-pressed', x === b); });
    $$('.price [data-m]').forEach(el => { el.textContent = y ? el.dataset.y : el.dataset.m; });
  }));
  $$('.faq details').forEach(d => d.addEventListener('toggle', () => {
    if (d.open) $$('.faq details').forEach(o => { if (o !== d) o.open = false; });
  }));
  /* ===== İLHAM SETİ ===== */
  const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Modüle git bağlantıları (akış şeması, meslek kartları) */
  $$('[data-goto-mod]').forEach(a => a.addEventListener('click', () => {
    const tab = $(`[data-mod="${a.dataset.gotoMod}"]`);
    if (tab) tab.click();
  }));

  /* Kaynak akış şeması: kartlardan merkeze, merkezden modüllere çizgiler */
  const flow = $('#flow');
  if (flow) {
    const svg = $('.flow-lines', flow);
    const drawFlow = () => {
      if (getComputedStyle(svg).display === 'none') return;
      const box = flow.getBoundingClientRect();
      const hub = $('[data-flow="hub"]', flow).getBoundingClientRect();
      const hx1 = hub.left - box.left, hx2 = hub.right - box.left, hy = hub.top - box.top + hub.height / 2;
      let paths = '';
      const curve = (x1, y1, x2, y2, i) => {
        const mx = (x1 + x2) / 2, d = `M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`;
        return `<path d="${d}"/><path class="flow-pulse" style="--d:${(i * 0.35).toFixed(2)}s" d="${d}"/>`;
      };
      $$('[data-flow="src"]', flow).forEach((c, i) => {
        const r = c.getBoundingClientRect();
        paths += curve(r.right - box.left, r.top - box.top + r.height / 2, hx1, hy, i);
      });
      $$('[data-flow="out"]', flow).forEach((c, i) => {
        const r = c.getBoundingClientRect();
        paths += curve(hx2, hy, r.left - box.left, r.top - box.top + r.height / 2, i + 4);
      });
      svg.setAttribute('viewBox', `0 0 ${box.width} ${box.height}`);
      svg.innerHTML = paths;
    };
    drawFlow();
    window.addEventListener('resize', drawFlow);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(drawFlow);
    if ('IntersectionObserver' in window && !rm) {
      const fio = new IntersectionObserver(es => es.forEach(e => {
        if (e.isIntersecting) { flow.classList.add('is-live'); drawFlow(); fio.disconnect(); }
      }), { threshold: 0.25 });
      fio.observe(flow);
    } else {
      flow.classList.add('is-live');
    }
  }

  /* Fark sayıları: kaydırdıkça "olmadan" değerinden "ile" değerine dönüşür */
  const farkRows = $$('[data-fark]');
  if (farkRows.length) {
    let anySample = false;
    farkRows.forEach(r => { if (r.dataset.sample) { r.classList.add('is-sample'); anySample = true; } });
    if (!anySample && $('#farkNote')) $('#farkNote').hidden = true;
    let fTick = false;
    const farkScroll = () => {
      fTick = false;
      const vh = window.innerHeight;
      farkRows.forEach(r => {
        const top = r.getBoundingClientRect().top;
        const k = rm ? 1 : Math.max(0, Math.min(1, (vh * 0.8 - top) / (vh * 0.4)));
        const e = 1 - Math.pow(1 - k, 3);
        const from = +r.dataset.from, to = +r.dataset.to;
        $('.fark-val', r).textContent = Math.round(from + (to - from) * e);
        r.classList.toggle('is-after', k >= 0.999);
      });
    };
    const farkReq = () => { if (!fTick) { fTick = true; requestAnimationFrame(farkScroll); } };
    window.addEventListener('scroll', farkReq, { passive: true });
    window.addEventListener('resize', farkReq);
    farkScroll();
  }

  /* Meslek sekmeleri */
  $$('[data-meslek]').forEach(btn => btn.addEventListener('click', () => {
    const key = btn.dataset.meslek;
    $$('[data-meslek]').forEach(x => { x.classList.toggle('is-on', x === btn); x.setAttribute('aria-selected', x === btn); });
    $$('[data-meslek-pane]').forEach(p => { p.hidden = p.dataset.meslekPane !== key; });
  }));

  /* Kaynak Arama: sorgu ilk görünüşte harf harf yazılır (sonuçlar hiç gizlenmez) */
  const qEl = $('#kaynakQuery');
  if (qEl && !rm) {
    const full = qEl.dataset.text || qEl.textContent;
    let typed = false;
    const typeQuery = () => {
      if (typed) return;
      typed = true;
      qEl.textContent = '';
      qEl.classList.add('is-typing');
      let i = 0;
      const step = () => {
        i += 1 + (Math.random() < 0.3 ? 1 : 0);
        qEl.textContent = full.slice(0, i);
        if (i < full.length) setTimeout(step, 28 + Math.random() * 30);
        else setTimeout(() => qEl.classList.remove('is-typing'), 600);
      };
      step();
    };
    const kTab = $('[data-mod="kaynak"]');
    if (kTab) kTab.addEventListener('click', () => setTimeout(typeQuery, 150));
    if ('IntersectionObserver' in window) {
      const qio = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { qio.disconnect(); typeQuery(); } }), { threshold: 0.6 });
      qio.observe(qEl);
    }
  }

  if ($('#year')) $('#year').textContent = new Date().getFullYear();
})();
