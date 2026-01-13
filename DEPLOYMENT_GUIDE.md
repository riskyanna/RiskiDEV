# Panduan Hosting Gratis (Full Stack)

Project ini menggunakan **React (Vite)** untuk Frontend dan **Express + MySQL** untuk Backend.
Untuk hosting gratis selamanya (Free Tier), kita akan menggunakan kombinasi:

1.  **Vercel**: Untuk hosting Frontend & Backend API.
2.  **TiDB Cloud** (atau Aiven): Untuk hosting Database MySQL Gratis.

---

## Langkah 1: Push Code ke GitHub

Pastikan seluruh project ini sudah di-upload ke repository GitHub kamu (Public/Private).

## Langkah 2: Buat Database Cloud (Gratis)

Karena di Vercel tidak ada database, kita pakai layanan database gratis.
Rekomendasi: **TiDB Cloud** (Serverless MySQL) karena mudah dan gratis 5GB.

1.  Buka [TiDB Cloud](https://tidbcloud.com/) dan Daftar.
2.  Buat **Cluster Baru** (Pilih "Serverless Tier" - Free).
3.  Setelah aktif, masuk ke dashboard database kamu.
4.  Cari tombol **"Connect"**.
5.  Pilih cara connect "General" atau "Node.js".
6.  Catat informasi berikut:
    - **Host** (misal: `gateway01...tidbcloud.com`)
    - **Port** (biasanya `4000`)
    - **User** (misal: `root`)
    - **Password** (yang kamu buat)
    - **Database Name** (bebas, misal `portfolio_db`)
    - **SSL**: TiDB butuh SSL, nanti kita set di Vercel.

## Langkah 3: Import SQL ke Database Cloud

Kamu perlu memindahkan table dari lokal ke Cloud.

1.  Di komputer lokal, buka SQL/phpMyAdmin, export database `portfolio_db`.
2.  Atau gunakan script SQL yang ada di folder `backend/database.sql` (jika ada) atau copas struktur tabel.
3.  Connect ke TiDB Cloud (bisa pakai DBeaver / HeidiSQL di laptop kamu dengan detail Host TiDB tadi).
4.  Jalankan query `CREATE TABLE...` untuk membuat tabel `users`, `portfolio`, `pricing_packages` di sana.

## Langkah 4: Deploy ke Vercel

1.  Buka [Vercel Dashboard](https://vercel.com).
2.  Klik **"Add New..."** -> **"Project"**.
3.  Import repository GitHub kamu.
4.  Di halaman konfigurasi "Configure Project":
    - **Framework Preset**: Vite (biasanya otomatis terdeteksi).
    - **Root Directory**: Biarkan `./`.
5.  **Environment Variables** (PENTING!):
    Masukkan data dari Langkah 2 di sini:
    - `DB_HOST` = (Host TiDB kamu)
    - `DB_USER` = (User TiDB)
    - `DB_PASSWORD` = (Password TiDB)
    - `DB_NAME` = `portfolio_db` (atau nama db di cloud)
    - `DB_PORT` = `4000`
    - `DB_SSL` = `true`
6.  Klik **Deploy**.

## FAQ (Pertanyaan Umum)

### Q: Bisakah saya pakai Netlify untuk Frontend?

**Bisa, tapi tidak disarankan**.
Jika Anda pakai Netlify untuk Frontend, Anda harus mencari hosting lain untuk Backend (seperti Render.com). Ini akan membuat setup lebih rumit karena backend dan frontend beda alamat (rawan error CORS).
**Solusi:** Gunakan Vercel sesuai panduan ini. Vercel bisa menampung Frontend (React) DAN Backend (Express) Anda sekaligus dalam satu tempat gratis.

### Q: Kenapa Backend perlu hosting khusus?

Netlify (biasa) hanya untuk file statis (HTML/CSS/JS). Backend Anda punya logika (Node.js) yang butuh server berjalan. Konfigurasi Vercel yang saya buat mengubah backend Anda menjadi "Serverless Function" agar bisa jalan tanpa sewa VPS mahal.

## Penjelasan Teknis

- Saya sudah menambahkan file `vercel.json` dan `api/index.js` agar backend Express kamu bisa jalan di Vercel sebagai "Serverless Function".
- File `backend/db.js` sudah saya update agar bisa membaca setting `DB_SSL=true` untuk koneksi aman ke Cloud DB.

Selamat! Web Portfolio kamu sekarang online dan bisa diakses siapa saja. 🚀
