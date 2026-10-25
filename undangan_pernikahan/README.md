# Undangan Pernikahan Digital: Justin & Hailey

Tugas mandiri mata kuliah Pemrograman Berbasis Platform. Project membuat undangan pernikahan digital yang dibuka lewat browser, dibuat dengan HTML, CSS, Bootstrap 5, dan JavaScript tanpa framework tambahan. Nama pasangan, tanggal, lokasi, dan nomor rekening di dalamnya hanya contoh. Semuanya fiktif dan tidak merujuk ke orang sungguhan.

## Apa saja yang ada di undangan

Saat dibuka, tamu melihat halaman sampul yang menyapa dengan namanya. Namanya diambil dari alamat, misalnya `?to=Bapak+Budi`. Setelah tombol "Buka Undangan" ditekan, halaman bergeser ke bagian utama: sapaan, profil mempelai, hitung mundur menuju hari pernikahan, dan kisah cinta dalam bentuk timeline.

Bagian acara menampilkan jadwal akad dan resepsi lengkap dengan tombol buka Google Maps dan simpan ke kalender (file `.ics`), serta peta di bawahnya. Setelah itu ada galeri foto yang bisa diperbesar, form RSVP dan ucapan, serta amplop digital berisi nomor rekening yang bisa disalin. Ucapan tamu disimpan di `localStorage` browser, dan tamu juga bisa mengonfirmasi kehadiran lewat WhatsApp.

Ada juga halaman `generator.html` untuk membuat link undangan per tamu. Tampilannya sudah disesuaikan untuk layar HP dan laptop.

## Cara menjalankan

1. Buka folder proyek di VS Code.
2. Klik kanan `index.html`, lalu pilih **Open with Live Server**.
3. Untuk mencoba nama tamu, tambahkan `?to=Nama+Tamu` di akhir alamat.


## Isi folder

```
├── index.html        halaman undangan
├── generator.html    halaman pembuat link tamu
├── vercel.json       pengaturan hosting di Vercel
├── css/style.css     semua tampilan
├── js/
│   ├── config.js     data undangan (nama, tanggal, acara, galeri, dll.)
│   ├── main.js       logika utama halaman
│   └── generator.js  logika pembuat link tamu
├── assets/
│   ├── favicon.svg
└── └── img/          ornamen bunga dan foto
```

## Cara mengubah isi

Semua data ada di `js/config.js`. Nama, tanggal, acara, kisah cinta, rekening, dan foto cukup diubah di file itu, lalu halaman menyesuaikan sendiri. Kalau mau mengganti foto, taruh filenya di `assets/img/` lalu samakan nama dan ekstensinya di bagian `gallery` atau `avatar` pada `config.js`. Huruf besar dan kecil pada nama file harus sama persis, karena Vercel membedakannya.

## Catatan

- Bootstrap, ikon, dan font dimuat dari internet (CDN), jadi perlu koneksi internet saat undangan dibuka.
- Ucapan tamu hanya tersimpan di browser masing-masing. Belum ada server atau database.
- Foto mempelai dan galeri berasal dari Unsplash dan dipakai sesuai lisensinya.

## Referensi

- Bootstrap 5.3: https://getbootstrap.com/docs/5.3/
- Bootstrap Icons: https://icons.getbootstrap.com/
- Google Fonts (Great Vibes, Cormorant Garamond, Jost): https://fonts.google.com/
- MDN Web Docs (IntersectionObserver, localStorage, Blob): https://developer.mozilla.org/
- Format kalender iCalendar (RFC 5545): https://datatracker.ietf.org/doc/html/rfc5545
- Foto: https://unsplash.com/
- Hosting: https://vercel.com/docs

## Dibuat oleh

Andrean Nur Wahid, Teknik Informatika F 25 (NIM 25051204250)