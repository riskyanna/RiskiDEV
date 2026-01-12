CREATE TABLE IF NOT EXISTS pricing_packages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(255) NOT NULL, -- e.g., 'Paket Hemat', 'Paket Mahasiswa'
    price_min DECIMAL(10, 2) NOT NULL,
    price_max DECIMAL(10, 2),
    description TEXT,
    features JSON, -- Stored as a JSON array of strings
    is_best_seller BOOLEAN DEFAULT FALSE,
    whatsapp_message VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
