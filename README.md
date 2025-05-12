# 🚗 HijackUMass

A rideshare-style web app for UMass Amherst students to coordinate carpooling — whether you **need a ride** or **have a ride to offer**.

## 🚀 Project Overview

- **Server** (in `/server`):
  - Express.js API with JWT-protected routes
  - PostgreSQL for persistence
  - Google OAuth + email/password authentication

- **Client** (in `/client`):
  - React + Vite front-end
  - Google OAuth + email/password login

## 📦 Getting Started

## 📋 Prerequisites

- Node.js v18+ & npm
- PostgreSQL v13+
- Vite

## 1. Install & Start PostgreSQL

```bash
sudo apt update
sudo apt install -y postgresql postgresql-contrib

sudo systemctl start postgresql
sudo systemctl enable postgresql
sudo systemctl status postgresql
```

## 🗄️ 2. Create Database User, Database & Grant Privileges

```bash
sudo -i -u postgres
psql
```

Inside the `psql` prompt:

```sql
CREATE USER hijack_user WITH PASSWORD 'hijack_pass';
CREATE DATABASE hijack_db OWNER hijack_user;
\q
exit
```

Now re-enter as `postgres` and grant all required privileges:

```bash
sudo -i -u postgres
psql -d hijack_db
```

Inside the `psql` prompt:

```sql
GRANT ALL PRIVILEGES ON DATABASE hijack_db TO hijack_user;
\c hijack_db
GRANT ALL PRIVILEGES ON SCHEMA public TO hijack_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO hijack_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO hijack_user;
\q
exit
```

## 🧱 3. Load the Schema (Structure Only)

Ensure you're in the project directory where `schema/hijack_schema.sql` exists:

```bash
psql -U hijack_user -d hijack_db -f schema/hijack_schema.sql
```

> When prompted, enter the password: `hijack_pass`

---


## 🔧 4. Environment Variables

### `/server/.env`:

```env
DATABASE_URL=postgresql://hijack_user:hijack_pass@localhost:5432/hijack_db
PORT=4000
JWT_SECRECT=super_secret_jwt_for_dev
GOOGLE_CLIENT_ID=517363244279-8qq1v80fde6660d12b0v8l2pl0cf4gtv.apps.googleusercontent.com
```

### `/client/.env`:

```env
VITE_GOOGLE_CLIENT_ID=517363244279-8qq1v80fde6660d12b0v8l2pl0cf4gtv.apps.googleusercontent.com
```

---
## Running the App

### 1. Start the backend server

In two separate terminal windows:

```bash
# Start the backend
cd server
npm run dev
# → http://localhost:4000
```

```bash
# Start the frontend
cd client
npm run dev
# → http://localhost:5173
```

## ❓ Troubleshooting

- **FATAL: role “hijack_user” does not exist**  
  → Create the role and DB exactly as shown above.

- **Permission denied for table**  
  → Run the GRANT statements to give full privileges.

- **JWT or Google client issues**  
  → Check that `.env` files are correctly filled out.

- **CORS or fetch errors**  
  → Ensure `CLIENT_URL` in the server `.env` matches the Vite port.

---

Your app will be fully functional at `http://localhost:5173`!