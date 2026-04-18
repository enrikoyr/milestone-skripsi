# 🎓 milestone-skripsi

> *"Skripsi itu bukan sprint, tapi maraton. Dan kamu butuh papan milestone biar nggak nyasar di tengah jalan."* 🏃‍♂️💨

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Database](https://img.shields.io/badge/Database-Cloudflare%20D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Made with](https://img.shields.io/badge/Made%20with-☕%20%2B%20Stress-brown?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Bebas%20Dipakai-green?style=for-the-badge)]()

---

## ✨ Apa Ini?

**milestone-skripsi** adalah aplikasi web sederhana untuk melacak progres skripsimu — dari semangat di awal sampai drama di akhir. 📋

Capek lihat skripsi cuma ada di kepala? Sekarang catat milestone-nya di sini, biar kamu tahu udah sejauh mana perjalanan (dan berapa jauh lagi yang harus ditempuh 😭).

---

## 🚀 Fitur

- 📌 **Catat Milestone** — Tambah, edit, dan hapus tahapan skripsimu dengan mudah
- ✅ **Tandai Progress** — Update status setiap milestone (belum mulai / sedang jalan / selesai!)
- 🗓️ **Pantau Timeline** — Lihat semua progresmu dalam satu tampilan
- 💾 **Data Tersimpan Aman** — Powered by Cloudflare D1, data kamu nggak ke mana-mana
- ⚡ **Super Cepat** — Deploy di Cloudflare Pages, loading-nya ngebut kayak semangat di BAB 1

---

## 🛠️ Tech Stack

| Teknologi | Kegunaan |
|---|---|
| 🌐 HTML + CSS + JavaScript | Frontend tampilannya |
| ⚙️ TypeScript (CF Functions) | Backend API-nya |
| 🗄️ Cloudflare D1 (SQLite) | Database penyimpanan data |
| ☁️ Cloudflare Pages | Hosting & deployment |

---

## 📖 Cara Pakai

1. **Buka websitenya** di browser kamu
2. **Tambah milestone baru** — klik tombol tambah dan isi nama tahapan skripsimu (contoh: "Bab 1 Selesai", "ACC Proposal", dll)
3. **Update statusnya** — tandai setiap milestone sesuai progres: belum mulai, sedang berjalan, atau sudah selesai ✅
4. **Pantau semua progress** — lihat gambaran besar perjalanan skripsimu dalam satu halaman
5. **Edit atau hapus** milestone kapanpun kamu mau — karena skripsi itu dinamis, kadang rencananya berubah 😅

---

## 📁 Struktur Proyek

```
milestone-skripsi/
├── index.html        # Tampilan utama aplikasi
├── style.css         # Semua yang bikin cantik
├── app.js            # Logika frontend
├── schema.sql        # Struktur database
├── wrangler.toml     # Konfigurasi Cloudflare
└── functions/        # API endpoints (Cloudflare Pages Functions)
```

---

## 🤝 Kontribusi

PR dan issue sangat terbuka! Kalau kamu mahasiswa yang juga lagi berjuang dengan skripsi dan punya ide fitur, jangan ragu untuk:

1. Fork repo ini
2. Buat branch baru (`git checkout -b fitur/ide-keren-kamu`)
3. Commit perubahanmu (`git commit -m 'Tambah fitur keren'`)
4. Push ke branch (`git push origin fitur/ide-keren-kamu`)
5. Buat Pull Request

---

## 💬 Pesan dari Developer

> Proyek ini dibuat di sela-sela ngerjain skripsi itu sendiri. Jadi kalau ada bug, anggap aja sebagai fitur eksklusif. 😄
>
> Semangat buat semua pejuang skripsi di luar sana — kamu pasti bisa! 💪

---

## 📄 Lisensi

Bebas dipakai untuk keperluan apapun. Kalau berguna, boleh kasih ⭐ di GitHub ya!

---

<p align="center">
  Dibuat dengan ❤️ dan ☕ yang sangat banyak oleh <a href="https://github.com/enrikoyr">enrikoyr</a>
  <br/>
  <i>Semoga skripsimu cepat ACC. Amin. 🙏</i>
</p>
