CREATE DATABASE IF NOT EXISTS portfolio_db;
USE portfolio_db;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL
);

-- 2. Portfolio Table
CREATE TABLE IF NOT EXISTS portfolio (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  category VARCHAR(255) NOT NULL,
  image_url TEXT,
  description TEXT,
  badge VARCHAR(50) DEFAULT 'Web Project',
  item_type VARCHAR(50) DEFAULT 'web', -- 'web' or 'app'
  project_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Pricing Table
CREATE TABLE IF NOT EXISTS pricing_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL,
    price_min DECIMAL(10, 2) NOT NULL,
    price_max DECIMAL(10, 2),
    description TEXT,
    features JSON,
    is_best_seller BOOLEAN DEFAULT FALSE,
    whatsapp_message VARCHAR(255),
    item_type VARCHAR(50) DEFAULT 'web', -- 'web' or 'app'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Order Clicks Table (Analytics)
CREATE TABLE IF NOT EXISTS order_clicks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  service_type VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- === SEED DATA ===

-- Admin User (Password: admin123)
INSERT INTO users (email, password) VALUES ('admin@example.com', 'admin123');

-- Pricing Packages (Web)
INSERT INTO pricing_packages (name, category, price_min, price_max, description, features, is_best_seller, whatsapp_message, item_type) VALUES
('Tugas Kecil / Landing Sederhana', 'Paket Hemat', 150000, 250000, 'Untuk tugas ringan 1 halaman atau landing sangat sederhana.', 
 '["1 halaman statis sederhana", "Menggunakan layout basic yang sudah tersedia", "Penyesuaian teks & warna ringan", "Revisi kecil 1x sebelum pengumpulan"]', 
 TRUE, 'Halo, saya ingin konsultasi tentang paket hemat', 'web'),

('Tugas Website / Portofolio Kuliah', 'Paket Mahasiswa', 350000, 750000, 'Untuk tugas individu / kelompok dengan brief dari dosen.', 
 '["1 halaman utama + 1-2 halaman tambahan", "Desain sederhana tapi rapi & responsif", "Mengikuti format/ketentuan tugas", "Revisi minor 1x setelah demo ke dosen", "Estimasi selesai 3-5 hari kerja"]', 
 FALSE, 'Halo, saya ingin tanya ketersediaan & antrian untuk paket mahasiswa', 'web'),

('Website Profil Organisasi / Event', 'Paket UKM / Organisasi', 1200000, 2500000, 'Untuk himpunan, BEM, komunitas, atau event kampus.', 
 '["3-5 halaman (Home, Tentang, Kegiatan, Tim, Kontak)", "Desain lebih polished & mobile-first", "Integrasi formulir pendaftaran / kontak sederhana", "Revisi 2x dalam masa pengerjaan", "Estimasi selesai 7-10 hari kerja"]', 
 FALSE, 'Halo, saya ingin diskusikan kebutuhan organisasi kami', 'web'),

('Personal Branding / Portfolio Kerja', 'Paket Profesional', 2000000, 4000000, 'Untuk freelancer, fresh graduate, dan profesional.', 
 '["4-6 halaman sesuai kebutuhan profil", "Copywriting ringan untuk struktur konten", "Fokus pada kredibilitas & hasil kerja", "Revisi 2-3x selama proses", "Estimasi selesai 10-14 hari kerja"]', 
 FALSE, 'Halo, saya ingin konsultasi paket profesional', 'web');

-- Pricing Packages (App Mobile)
INSERT INTO pricing_packages (name, category, price_min, price_max, description, features, is_best_seller, whatsapp_message, item_type) VALUES
('Aplikasi Tugas Kuliah', 'Student App', 500000, 1000000, 'Aplikasi Android sederhana untuk tugas akhir atau praktikum.', 
 '["UI/UX Standard Material Design", "Fitur CRUD (Create, Read, Update, Delete)", "Database Lokal (SQLite/Room) atau Firebase", "Source Code Android Studio / Flutter", "Revisi bug max 2x"]', 
 TRUE, 'Halo, saya butuh aplikasi mobile untuk tugas kuliah', 'app'),

('Aplikasi UMKM / Toko Online', 'Business Starter', 1500000, 3000000, 'Aplikasi katalog atau toko online sederhana untuk usaha.', 
 '["Desain Custom Branding Toko", "Fitur Katalog Produk & Detail", "Integrasi WhatsApp Order", "Admin Panel Sederhana (Web/App)", "Publish ke Play Store (Akun Developer Client)"]', 
 FALSE, 'Halo, saya tertarik buat aplikasi untuk usaha saya', 'app');
