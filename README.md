# 🔐 CipherVault — Encrypted File Storage Portal

A secure web-based file storage system demonstrating AES-256, DES, RSA digital signatures, malware detection, and JWT authentication.

## Tech Stack
- **Frontend**: React.js + Bootstrap 5
- **Backend**: Node.js + Express.js
- **Database**: MongoDB
- **Crypto**: AES-256, DES, RSA-2048, SHA-256 (Node built-in `crypto` + `node-forge`)

## Quick Start

### Prerequisites
- Node.js 18+
- MongoDB running locally (`mongod`)

### 1. Install dependencies
```bash
npm run install-all
```

### 2. Configure environment
Edit `.env` (already preconfigured for local dev):
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/ciphervault
JWT_SECRET=ciphervault_super_secret_jwt_key_2024
AES_SECRET_KEY=ciphervault_aes_256_secret_key_32ch
```

### 3. Start the backend
```bash
npm run dev
```

### 4. Start the frontend (new terminal)
```bash
cd client
npm start
```

The app opens at **http://localhost:3000**

---

## API Endpoints

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register + generate RSA keys |
| POST | /api/auth/login | Login + get JWT |
| GET  | /api/auth/me | Get current user |

### Files
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/files/upload | Upload + encrypt + sign |
| GET  | /api/files | List user's files |
| GET  | /api/files/:id/download | Decrypt + download |
| GET  | /api/files/:id/verify | Verify RSA signature |
| DELETE | /api/files/:id | Delete file |

### Tests
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/test/aes-performance | AES timing |
| GET | /api/test/des-performance | DES timing |
| GET | /api/test/comparison | Side-by-side comparison |

---

## Security Features

| Feature | Implementation |
|---------|---------------|
| Passwords | bcrypt hashing |
| File Encryption | AES-256-CBC |
| Digital Signatures | RSA-2048 |
| Malware Detection | SHA-256 hash lookup |
| Access Control | JWT Bearer tokens |
| Storage | Encrypted bytes only |

---

## Demo Flow
1. Register → save private key
2. Login
3. Upload a file (with private key for signature)
4. View encrypted file in My Files
5. Download → automatically decrypted
6. Verify digital signature
7. Run AES vs DES comparison

## Project Structure
```
ciphervault/
├── server/
│   ├── app.js
│   ├── controllers/      # authController, fileController, testController
│   ├── models/           # User.js, File.js
│   ├── routes/           # authRoutes, fileRoutes, testRoutes
│   ├── middleware/        # authMiddleware.js (JWT)
│   ├── utils/            # cryptoUtils.js (AES, DES, RSA, SHA256)
│   └── uploads/encrypted/ # encrypted file storage
├── client/
│   └── src/
│       ├── pages/        # All React pages
│       ├── components/   # DashboardLayout
│       ├── services/     # api.js 
│       └── context/      # AuthContext.js
└── .env
```
