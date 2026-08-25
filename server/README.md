# Farm2Market Buyer API

Buyer + marketplace backend only. It uses Express, TypeScript, MongoDB/Mongoose, JWT, bcrypt, Zod, Helmet, CORS, and rate limiting.

```powershell
cd server
Copy-Item .env.example .env
npm install
npm run dev
```

MongoDB must be running at `MONGODB_URI`. The API listens on `http://localhost:4000` by default.
