# 🧺 Mory Laundry - Full Stack Express + React

Website laundry dengan **Express.js (Backend)** dan **React (Frontend)**.

## 📁 Struktur Project

```
mory-laundry/
├── backend/
│   ├── server.js           ← Entry point
│   ├── config/
│   │   └── koneksi.js      ← Koneksi MySQL
│   ├── middleware/
│   ├── routes/
│   └── controllers/
│
├── frontend/
│   ├── src/                ← React source
│   └── dist/               ← Build result
│
├── database/
│   └── mory_laundry.sql
│
├── package.json
└── .env
```

## 🛠️ Cara Install & Jalankan

### 1. Setup Database

```bash
mysql -u root -p < database/mory_laundry.sql
```

Atau import via phpMyAdmin.

### 2. Konfigurasi `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=mory_laundry
JWT_SECRET=mory_laundry_jwt_secret_key_2025
PORT=3000
```

### 3. Install & Build & Jalankan

```bash
npm install
npm run build
node backend/server.js
```

Atau singkat:
```bash
npm install
npm start
```

### 4. Buka Browser

```
http://localhost:3000
```

## 👤 Akun Default

| Role | Username | Password |
|------|----------|----------|
| Admin | admin | password123 |
| Customer | customer | password123 |

## ✨ Fitur (Sesuai Soal UAS)

### Question 1: Website (15%)
- ✅ Hosted online
- ✅ CMS untuk admin
- ✅ Responsive

### Question 2: Signup (20%)
- ✅ 3+ field (nama, username, password, confirm password)
- ✅ Validasi form
- ✅ Notifikasi sukses/gagal
- ✅ Redirect ke login

### Question 3: Login (15%)
- ✅ Validasi dengan JWT
- ✅ Redirect ke dashboard
- ✅ Tampil username + logout

### Question 4: Master CRUD (20%)
- ✅ Konfirmasi sebelum delete
- ✅ Notifikasi setelah operasi
- ✅ Search/filter
- ✅ Print

### Question 5: Transaksi & Report (30%)
- ✅ Multiple item transaksi
- ✅ Report transaksi
- ✅ Search/filter
- ✅ Print

## 📡 API Endpoints

### Auth
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PUT /api/auth/profile`

### Services
- `GET /api/services`
- `GET /api/services/admin/all`
- `POST /api/services`
- `PUT /api/services/:id`
- `DELETE /api/services/:id`

### Orders
- `GET /api/orders`
- `GET /api/orders/my-orders`
- `GET /api/orders/:id`
- `POST /api/orders`
- `PUT /api/orders/:id/status`

### Users
- `GET /api/users`
- `DELETE /api/users/:id`

---

Made for UAS Advance Web Programming
