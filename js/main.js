(() => {
  'use strict';
 
  const $  = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const get = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
  const pad = n => String(n).padStart(2, '0');
 
  const C = CONFIG;
  const coupleTitle = `${C.groom.nickname} & ${C.bride.nickname}`;
 
  function bindConfig() {
    $$('[data-bind]').forEach(el => {
      const value = get(C, el.dataset.bind);
      if (value != null) el.textContent = value;
    });
    $$('[data-bind-src]').forEach(el => {
      const value = get(C, el.dataset.bindSrc);
      if (value) el.src = value;
    });
    document.title = `The Wedding of ${coupleTitle}`;
    $('#mapFrame').src =
      `https://maps.google.com/maps?q=${encodeURIComponent(C.mapEmbedQuery)}&output=embed`;
  }
 
  function guestFromUrl() {
    const raw = new URLSearchParams(window.location.search).get('to');
    if (!raw) return '';
    return raw.replace(/\s+/g, ' ').trim().slice(0, 60);
  }
 
  function setGuestName() {
    const name = guestFromUrl();
    if (name) $('#guestName').textContent = name;
  }
 
  function openInvitation() {
    const cover = $('#cover');
    cover.classList.add('is-open');
    document.body.classList.remove('locked');
    document.body.classList.add('opened');
    window.scrollTo(0, 0);
 
    initReveal();
 
    const hero = $('#hero');
    hero.setAttribute('tabindex', '-1');
    hero.focus({ preventScroll: true });
 
    setTimeout(() => { cover.style.display = 'none'; }, 1200);
  }
 
  function renderStory() {
    $('#storyList').innerHTML = C.story.map((s, i) => `
      <li class="timeline-item reveal ${i % 2 ? 'reveal-right' : 'reveal-left'}">
        <span class="t-dot"><i class="bi bi-heart-fill"></i></span>
        <div class="t-card">
          <span class="t-year">${s.year}</span>
          <h3>${s.title}</h3>
          <p>${s.text}</p>
        </div>
      </li>`).join('');
  }
 
  const mapsLink = ev =>
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ev.mapQuery)}`;
 
  function renderEvents() {
    $('#eventList').innerHTML = C.events.map((e, i) => `
      <div class="col-lg-6 reveal ${i % 2 ? 'reveal-right' : 'reveal-left'}">
        <article class="event-card h-100">
          <div class="event-icon"><i class="bi ${e.icon}"></i></div>
          <h3 class="event-title">${e.title}</h3>
          <ul class="event-meta list-unstyled">
            <li><i class="bi bi-calendar-event"></i><span>${e.date}</span></li>
            <li><i class="bi bi-clock"></i><span>${e.time}</span></li>
            <li><i class="bi bi-geo-alt"></i><span><strong>${e.venue}</strong><br>${e.address}</span></li>
          </ul>
          <p class="event-note">${e.note}</p>
          <div class="d-flex flex-wrap gap-2 justify-content-center">
            <a class="btn btn-outline-gold btn-sm" href="${mapsLink(e)}" target="_blank" rel="noopener">
              <i class="bi bi-map"></i> Buka Maps
            </a>
            <button class="btn btn-gold btn-sm" type="button" data-ics="${e.id}">
              <i class="bi bi-calendar-plus"></i> Simpan ke Kalender
            </button>
          </div>
        </article>
      </div>`).join('');
  }
 
  function renderGallery() {
    $('#galleryGrid').innerHTML = C.gallery.map((g, i) => `
      <button type="button" class="gallery-item reveal reveal-zoom" style="--d:${(i % 3) * 0.12}s"
              data-gallery="${i}" aria-label="Perbesar foto: ${g.caption}">
        <img src="${g.src}" alt="${g.caption}" loading="lazy">
        <span class="gallery-cap"><i class="bi bi-zoom-in"></i> ${g.caption}</span>
      </button>`).join('');
 
    $('#lightboxInner').innerHTML = C.gallery.map((g, i) => `
      <div class="carousel-item${i === 0 ? ' active' : ''}">
        <img src="${g.src}" alt="${g.caption}">
        <p class="lightbox-cap">${g.caption}</p>
      </div>`).join('');
  }
 
  function openLightbox(index) {
    $$('.carousel-item', $('#lightboxInner')).forEach((el, i) =>
      el.classList.toggle('active', i === index));
    bootstrap.Modal.getOrCreateInstance($('#lightbox')).show();
  }
 
  function renderGifts() {
    $('#giftList').innerHTML = C.gifts.map((g, i) => `
      <div class="col-md-6 reveal reveal-zoom" style="--d:${i * 0.15}s">
        <div class="bank-card">
          <div class="bank-top"><span class="bank-name">${g.bank}</span><i class="bi bi-wallet2"></i></div>
          <div class="bank-chip" aria-hidden="true"></div>
          <p class="bank-number">${g.number}</p>
          <p class="bank-owner">a.n. ${g.owner}</p>
          <button class="btn btn-light btn-sm rounded-pill" type="button" data-copy="${g.number.replace(/\s/g, '')}">
            <i class="bi bi-clipboard"></i> Salin Nomor
          </button>
        </div>
      </div>`).join('');
 
    const addressCard = $('.address-card');
    if (!C.giftAddress) {
      if (addressCard) addressCard.remove();
      return;
    }
    $('#giftReceiver').textContent = C.giftAddress.receiver;
    $('#giftAddressText').textContent = C.giftAddress.address;
    $('#copyAddress').dataset.copy = `${C.giftAddress.receiver}\n${C.giftAddress.address}`;
  }
 
  function initCountdown() {
    const target = new Date(C.weddingDate).getTime();
    const els = {
      d: $('#cd-days'), h: $('#cd-hours'), m: $('#cd-minutes'), s: $('#cd-seconds')
    };
 
    const tick = () => {
      const diff = Math.max(0, target - Date.now());
      const sec = Math.floor(diff / 1000);
      els.d.textContent = pad(Math.floor(sec / 86400));
      els.h.textContent = pad(Math.floor((sec % 86400) / 3600));
      els.m.textContent = pad(Math.floor((sec % 3600) / 60));
      els.s.textContent = pad(sec % 60);
      $('#countdownDone').hidden = diff > 0;
    };
    tick();
    setInterval(tick, 1000);
  }
 
  function downloadICS(ev) {
    const fmt = d => new Date(d).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
    const esc = s => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n');
    const lines = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Undangan Digital//ID',
      'CALSCALE:GREGORIAN',
      'BEGIN:VEVENT',
      `UID:${ev.id}-${fmt(ev.start)}@undangan-digital`,
      `DTSTAMP:${fmt(new Date())}`,
      `DTSTART:${fmt(ev.start)}`,
      `DTEND:${fmt(ev.end)}`,
      `SUMMARY:${esc(`${ev.title} ${coupleTitle}`)}`,
      `LOCATION:${esc(`${ev.venue}, ${ev.address}`)}`,
      `DESCRIPTION:${esc(ev.note)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ];
    const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${ev.id}-${C.groom.nickname}-${C.bride.nickname}.ics`.toLowerCase();
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1500);
    toast(`${ev.title} ditambahkan ke file kalender.`);
  }
 
  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (_) {
      return false;
    }
  }
 
  function toast(message, icon = 'bi-check-circle-fill') {
    const box = $('#toastBox');
    const el = document.createElement('div');
    el.className = 'toast align-items-center text-bg-dark border-0';
    el.setAttribute('role', 'status');
    el.setAttribute('aria-live', 'polite');
    el.innerHTML = `
      <div class="d-flex">
        <div class="toast-body"><i class="bi ${icon} me-2 text-warning"></i><span></span></div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto"
                data-bs-dismiss="toast" aria-label="Tutup"></button>
      </div>`;
    $('span', el).textContent = message;
    box.appendChild(el);
    el.addEventListener('hidden.bs.toast', () => el.remove());
    new bootstrap.Toast(el, { delay: 2800 }).show();
  }
 
  const ATTEND = {
    hadir: { label: 'Hadir', cls: 'text-bg-success' },
    tidak: { label: 'Tidak Hadir', cls: 'text-bg-secondary' },
    ragu:  { label: 'Masih Ragu', cls: 'text-bg-warning' }
  };
  const AVATAR_COLORS = ['#2c5142', '#7f9a82', '#b8924a', '#a86f5a', '#5f7a8f', '#8a6f93'];
 
  function loadWishes() {
    try {
      const data = JSON.parse(localStorage.getItem(C.storageKey));
      return Array.isArray(data) ? data : [];
    } catch (_) {
      return [];
    }
  }
 
  function saveWishes(list) {
    try {
      localStorage.setItem(C.storageKey, JSON.stringify(list.slice(0, 100)));
    } catch (_) { }
  }
 
  function timeAgo(iso) {
    const diff = (Date.now() - new Date(iso).getTime()) / 1000;
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)} menit lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} jam lalu`;
    if (diff < 86400 * 7) return `${Math.floor(diff / 86400)} hari lalu`;
    return new Date(iso).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  }
 
  function renderWishes() {
    const list = [...loadWishes(), ...C.sampleWishes]
      .sort((a, b) => new Date(b.time) - new Date(a.time));
    const box = $('#wishList');
    box.textContent = '';
 
    list.forEach(w => {
      const status = ATTEND[w.attendance] || ATTEND.ragu;
      const initial = (w.name || '?').trim().charAt(0).toUpperCase();
      const colorIdx = [...(w.name || '')].reduce((s, ch) => s + ch.charCodeAt(0), 0) % AVATAR_COLORS.length;
 
      const item = document.createElement('article');
      item.className = 'wish';
 
      const avatar = document.createElement('div');
      avatar.className = 'wish-avatar';
      avatar.style.setProperty('--c', AVATAR_COLORS[colorIdx]);
      avatar.textContent = initial;
 
      const body = document.createElement('div');
      body.className = 'wish-body';
 
      const head = document.createElement('div');
      head.className = 'wish-head';
      const name = document.createElement('strong');
      name.textContent = w.name;
      const badge = document.createElement('span');
      badge.className = `badge rounded-pill ${status.cls}`;
      badge.textContent = status.label;
      head.append(name, badge);
 
      const msg = document.createElement('p');
      msg.className = 'wish-msg';
      msg.textContent = w.message;
 
      const time = document.createElement('small');
      time.className = 'wish-time';
      time.textContent = timeAgo(w.time);
 
      body.append(head, msg, time);
      item.append(avatar, body);
      box.appendChild(item);
    });
 
    const comingGuests = list
      .filter(w => w.attendance === 'hadir')
      .reduce((sum, w) => sum + (Number(w.guests) || 1), 0);
    $('#wishCount').textContent = `${list.length} ucapan · ${comingGuests} tamu konfirmasi hadir`;
  }
 
  function initRsvp() {
    const form = $('#rsvpForm');
    const f = form.elements;
    const guestsSelect = $('#guestsSelect');
    const counter = $('#msgCount');
 
    const preset = guestFromUrl();
    if (preset) f.guestName.value = preset;
 
    const readForm = () => ({
      name: f.guestName.value.trim().slice(0, 50),
      attendance: f.attendance.value,
      guests: Number(f.guests.value) || 1,
      message: f.message.value.trim().slice(0, 300),
      time: new Date().toISOString()
    });
 
    $$('input[name="attendance"]', form).forEach(r => r.addEventListener('change', () => {
      guestsSelect.disabled = f.attendance.value === 'tidak';
    }));
 
    f.message.addEventListener('input', () => {
      counter.textContent = `${f.message.value.length}/300`;
    });
 
    form.addEventListener('submit', e => {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        return;
      }
      const data = readForm();
      saveWishes([data, ...loadWishes()]);
      renderWishes();
      toast('Terima kasih! Ucapan Anda sudah tersimpan.', 'bi-heart-fill');
 
      form.reset();
      form.classList.remove('was-validated');
      guestsSelect.disabled = false;
      counter.textContent = '0/300';
      if (preset) f.guestName.value = preset;
      $('#wishList').scrollTop = 0;
    });
 
    $('#sendWa').addEventListener('click', () => {
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        toast('Lengkapi formulir terlebih dahulu.', 'bi-exclamation-circle-fill');
        return;
      }
      const d = readForm();
      const status = {
        hadir: `akan hadir bersama ${d.guests} orang`,
        tidak: 'berhalangan hadir',
        ragu: 'belum bisa memastikan kehadiran'
      }[d.attendance];
      const text = `Assalamu'alaikum, saya ${d.name} ${status} pada pernikahan ${coupleTitle}.\n\n"${d.message}"`;
      window.open(`https://wa.me/${C.whatsapp}?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
    });
  }
 
  function initReveal() {
    const items = $$('.reveal');
    const revealObserver = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => revealObserver.observe(el));
  }
 
  function initDock() {
    const links = $$('.dock a');
    const map = new Map();
    links.forEach(a => {
      const sec = $(a.getAttribute('href'));
      if (sec) map.set(sec, a);
    });
    const obs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        links.forEach(l => l.classList.remove('active'));
        map.get(entry.target).classList.add('active');
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((_, sec) => obs.observe(sec));
  }
 
  function initDelegates() {
    document.addEventListener('click', async e => {
      const ics = e.target.closest('[data-ics]');
      if (ics) {
        const ev = C.events.find(x => x.id === ics.dataset.ics);
        if (ev) downloadICS(ev);
        return;
      }
 
      const copy = e.target.closest('[data-copy]');
      if (copy) {
        const ok = await copyText(copy.dataset.copy);
        toast(ok ? 'Berhasil disalin ke clipboard.' : 'Gagal menyalin.',
              ok ? 'bi-clipboard-check-fill' : 'bi-exclamation-circle-fill');
        return;
      }
 
      const thumb = e.target.closest('[data-gallery]');
      if (thumb) openLightbox(Number(thumb.dataset.gallery));
    });
  }
 
  function init() {
    bindConfig();
    setGuestName();
    renderStory();
    renderEvents();
    renderGallery();
    renderGifts();
    renderWishes();
    initCountdown();
    initRsvp();
    initDock();
    initDelegates();
    $('#openBtn').addEventListener('click', openInvitation);
  }
 
  init();
})();