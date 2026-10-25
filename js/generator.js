(() => {
  'use strict';

  const $ = sel => document.querySelector(sel);
  const baseInput = $('#baseUrl');
  const namesInput = $('#names');
  const result = $('#result');
  const alertBox = $('#genAlert');

  if (/^https?:/.test(window.location.origin)) {
    baseInput.value = window.location.origin + '/';
  }

  function showError(msg) {
    alertBox.textContent = msg;
    alertBox.hidden = false;
  }

  function buildRow(name, link) {
    const row = document.createElement('div');
    row.className = 'gen-row';

    const label = document.createElement('strong');
    label.textContent = name;

    const input = document.createElement('input');
    input.className = 'form-control form-control-sm';
    input.readOnly = true;
    input.value = link;
    input.setAttribute('aria-label', `Tautan untuk ${name}`);

    const copyBtn = document.createElement('button');
    copyBtn.type = 'button';
    copyBtn.className = 'btn btn-gold btn-sm';
    copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Salin';
    copyBtn.addEventListener('click', async () => {
      await navigator.clipboard.writeText(link);
      copyBtn.innerHTML = '<i class="bi bi-clipboard-check"></i> Tersalin';
      setTimeout(() => { copyBtn.innerHTML = '<i class="bi bi-clipboard"></i> Salin'; }, 1500);
    });

    const text = `Assalamu'alaikum Wr. Wb.\n\nKepada Yth. ${name},\nKami mengundang Anda untuk hadir di hari pernikahan kami. Detail undangan dapat dibuka melalui tautan berikut:\n\n${link}\n\nTerima kasih atas doa dan kehadirannya.`;
    const wa = document.createElement('a');
    wa.className = 'btn btn-outline-gold btn-sm';
    wa.target = '_blank';
    wa.rel = 'noopener';
    wa.href = `https://wa.me/?text=${encodeURIComponent(text)}`;
    wa.innerHTML = '<i class="bi bi-whatsapp"></i> WhatsApp';

    const actions = document.createElement('div');
    actions.className = 'gen-actions';
    actions.append(copyBtn, wa);

    row.append(label, input, actions);
    return row;
  }

  $('#genBtn').addEventListener('click', () => {
    alertBox.hidden = true;
    result.textContent = '';

    let base;
    try {
      base = new URL(baseInput.value.trim());
    } catch (_) {
      showError('Isi alamat undangan dengan benar, contoh: https://undangan-anda.vercel.app/');
      return;
    }

    const names = namesInput.value
      .split('\n')
      .map(n => n.replace(/\s+/g, ' ').trim())
      .filter(Boolean);

    if (!names.length) {
      showError('Masukkan minimal satu nama tamu (satu nama per baris).');
      return;
    }

    names.forEach(name => {
      const url = new URL(base.href);
      url.searchParams.set('to', name);
      result.appendChild(buildRow(name, url.toString()));
    });
  });
})();