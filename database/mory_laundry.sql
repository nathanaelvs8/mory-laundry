-- =============================================
-- MORY LAUNDRY DATABASE
-- =============================================

CREATE DATABASE IF NOT EXISTS mory_laundry;
USE mory_laundry;

-- =============================================
-- TABEL USERS
-- =============================================
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    full_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    role ENUM('admin', 'pelanggan') DEFAULT 'pelanggan',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABEL SERVICES (LAYANAN)
-- =============================================
CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_name VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    description TEXT,
    is_active TINYINT(1) DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- =============================================
-- TABEL ORDERS (PESANAN)
-- =============================================
CREATE TABLE IF NOT EXISTS orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(20) NOT NULL UNIQUE,
    user_id INT NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    phone_number VARCHAR(20),
    total_price DECIMAL(10, 2) NOT NULL,
    status ENUM('Antrian', 'Proses Cuci', 'Proses Kering', 'Setrika', 'Siap Diambil', 'Selesai', 'Dibatalkan') DEFAULT 'Antrian',
    entry_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_date TIMESTAMP NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- =============================================
-- TABEL ORDER DETAILS (DETAIL PESANAN)
-- =============================================
CREATE TABLE IF NOT EXISTS order_details (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_id INT NOT NULL,
    service_id INT NOT NULL,
    quantity DECIMAL(10, 2) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    subtotal DECIMAL(10, 2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES services(id) ON DELETE RESTRICT
);

-- =============================================
-- DATA DEFAULT
-- =============================================

-- Admin (password: password123)
INSERT INTO users (username, password, full_name, phone_number, role) VALUES 
('admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Administrator', '081234567890', 'admin');

-- Customer (password: password123)
INSERT INTO users (username, password, full_name, phone_number, role) VALUES 
('customer', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Customer Test', '081234567891', 'pelanggan');

-- Services
INSERT INTO services (service_name, unit, price, description, is_active) VALUES
('Cuci Kering', 'per 5 kg', 22000, 'Paket cuci dan pengeringan standar', 1),
('Cuci Kering Lipat', 'per 5 kg', 25000, 'Paket cuci, kering, dan lipat rapi', 1),
('Cuci Kering Setrika', 'per 5 kg', 40000, 'Paket premium dengan hasil setrika rapi', 1),
('Cuci Sepatu', 'per pasang', 25000, 'Cuci sepatu semua jenis hingga bersih', 1),
('Bedcover Besar', 'per pcs', 35000, 'Bedcover ukuran King/Queen', 1),
('Bedcover Kecil', 'per pcs', 25000, 'Bedcover ukuran Single', 1),
('Boneka Besar', 'per pcs', 35000, 'Boneka ukuran > 50cm', 1),
('Boneka Kecil', 'per pcs', 25000, 'Boneka ukuran < 50cm', 1),
('Karpet', 'per m²', 15000, 'Karpet per meter persegi', 1);

-- Sample Orders
INSERT INTO orders (order_number, user_id, customer_name, phone_number, total_price, status, notes) VALUES
('MRY00000001', 2, 'Customer Test', '081234567891', 65000, 'Selesai', 'Pesanan pertama'),
('MRY00000002', 2, 'Customer Test', '081234567891', 40000, 'Proses Cuci', NULL);

-- Order Details
INSERT INTO order_details (order_id, service_id, quantity, price, subtotal) VALUES
(1, 2, 1, 25000, 25000),
(1, 3, 1, 40000, 40000),
(2, 3, 1, 40000, 40000);
