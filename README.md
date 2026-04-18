# 🎓 milestone-skripsi

> *"Skripsi itu bukan sprint, tapi maraton. Dan kamu butuh papan milestone biar nggak nyasar di tengah jalan."* 🏃‍♂️💨

[![Deploy to Cloudflare Pages](https://img.shields.io/badge/Deploy-Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://pages.cloudflare.com/)
[![Database](https://img.shields.io/badge/Database-Cloudflare%20D1-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)](https://developers.cloudflare.com/d1/)
[![Made with](https://img.shields.io/badge/Made%20with-☕%20%2B%20Stress-brown?style=for-the-badge)]()
[![License](https://img.shields.io/badge/License-Bebas%20Dipakai-green?style=for-the-badge)]()

---

## ✨ Apa Ini?

Halo!

Perkenalkan, saya Enriko Yudhistira Ramadhan, dosen di Jurusan Informatika, Fakultas Teknik, Universitas Tanjungpura

Saya mengembangkan sistem milestone otomatis yang bisa membuat kamu lebih termotivasi untuk menyelesaikan tugas akhir dengan cepat. Biasanya kamu pasti bingung, rentang jadwal seperti apa yang baik untuk menyelesaikan Tugas Akhir agar bisa selesai tepat waktu...

Jangan bingung lagi, sekarang ada milestone.enriko.id!!!!!

Sistematis penggunaannya adalah, kamu masukkan nama, NIM, dan tanggal persetujuan judul skripsi kalian. Kemudian masukkan PIN yang nantinya diperlukan untuk centang progress milestone kamu. 

Dengan menambahkan nama kamu di leaderboard, kamu berkomitmen untuk menyelesaikan skripsi kamu dalam kurun waktu kurang lebih 1 tahun!

Masing-masing milestone akan diberikan durasi maksimum. Jika kalian telat, akan ada konsekuensinya!

Kita kadang kesulitan dalam mengatur diri kita sendiri. Walaupun kita berpikir "Aku harus menyelesaikan naskah proposal dalam waktu 3 bulan", tanpa adanya aturan, pikiran tersebut akan mudah untuk kita langgar sendiri. 

Dengan menggunakan sistem milestone, kalian dapat motivasi eksternal yang dapat memotivasi kalian!

Ingat, Lulus Tepat Waktu selalu lebih baik daripada telat!

Capek lihat skripsi cuma ada di kepala? Sekarang catat milestone-nya di sini, biar kamu tahu udah sejauh mana perjalanan (dan berapa jauh lagi yang harus ditempuh 😭).

---

## 🚀 Fitur

- 📌 **Daftar ke Papan Leaderboard** — Tambahkan nama kamu di leaderboard!
- ✅ **Tandai Progress** — Update status setiap milestonemu setiap kamu menyelesaikan BAB - BAB Skripsi!
- 🗓️ **Pantau Timeline** — Lihat Tanggal Deadline yang dihitung oleh sistem!
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
2. **Masukan Nama, NIM, tanggal persetujuan judul, dan PIN. PIN akan digunakan untuk mencentang progress kamu sendiri, jadi diingat ya!** — 
3. **Update statusnya** — Setiap kamu menyelesaikan BAB Skripsi, pencet tanda ✅ dan masukkan PIN kamu
4. **Jangan sampai telat** — Jangan sampai kamu telat mengerjakan milestone kamu ya!

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

Masukan untuk Aplikasi sangat diterima!

---

## 📄 Lisensi

Bebas dipakai untuk keperluan apapun. Kalau berguna, boleh kasih ⭐ di GitHub ya!

---

<p align="center">
  Dibuat untuk Aktualisasi LATSAR oleh <a href="https://github.com/enrikoyr">enrikoyr</a>
  <br/>
  <i>Semoga skripsimu cepat ACC. Amin. 🙏</i>
</p>
