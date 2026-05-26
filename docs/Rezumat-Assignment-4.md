# Rezumat — Assignment 4 (Bronze + Silver)

**Proiect:** Portal LT1

---

## Cerințe implementate

### Bronze
- Login / Register securizat (parole hash bcrypt)
- HTTPS (certificat dev în `portal-lt1-backend/certs/`)
- Token JWT cu rol + permisiuni
- Logout la inactivitate (frontend, 30 min)
- Server pe LAN (vezi `dev-network.env`)

### Silver
1. **Autentificare pentru toate rolurile** — `admin` și `user`, permisiuni din DB
2. **Token-uri pentru scheme de permisiuni** — access JWT (15 min) + refresh (7 zile) în `UserSession`
3. **Gestiune sesiuni** — `POST /api/auth/refresh`, `POST /api/auth/logout`, revocare la reset parolă
4. **Autentificare în 3 pași**
   - Pas 1: parolă (`POST /api/auth/login`)
   - Pas 2: OTP 6 cifre (`POST /api/auth/verify-otp`)
   - Pas 3: sesiune (access + refresh token)
5. **Recuperare parolă** — `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`

---

## Conturi test

| Rol | Email | Parolă |
|-----|--------|--------|
| admin | `admin@lt1.ro` | `admin123` |
| user | `profesor@lt1.ro` | `profesor123` |

La login, după parolă, introdu codul OTP afișat pe ecran (mod dev) sau din consola serverului.

---

## Configurare rețea (fără IP manual în `.env`)

1. Copiază `dev-network.env.example` → `dev-network.env`
2. Setează `SERVER_IP` (PC backend) și `CLIENT_IP` (PC/Mac browser)
3. `npm run prepare:dev-tls`
4. Backend: `npm start` (cu SSL în `.env`)
5. Frontend: `npm run dev` — API = `https://SERVER_IP:3000` automat

---

## API auth

| Metodă | Rută | Rol |
|--------|------|-----|
| POST | `/api/auth/login` | Pas 1 — parolă |
| POST | `/api/auth/verify-otp` | Pas 2 — OTP |
| POST | `/api/auth/register` | Cont nou (user) |
| POST | `/api/auth/refresh` | Reînnoire access token |
| POST | `/api/auth/logout` | Revocare sesiune |
| POST | `/api/auth/forgot-password` | Cerere reset |
| POST | `/api/auth/reset-password` | Parolă nouă |

---

## Teste

```bash
npm run test:backend
npm run test:frontend
```

Fișiere noi: `assignment4.auth.test.js`, `helpers/authLogin.js`

---

## Demonstrație 2 PC-uri

1. **Server:** backend HTTPS pe `SERVER_IP:3000`
2. **Client:** frontend pe `CLIENT_IP:5173`
3. Login admin → OTP → documente + chat
4. Login user → 403 la creare document, OK la chat
5. Forgot password → reset → login cu parola nouă
