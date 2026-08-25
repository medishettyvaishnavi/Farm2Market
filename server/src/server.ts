import { app } from './app.js';
import { connectDatabase } from './config/db.js';
import { env } from './config/env.js';

connectDatabase().then(() => app.listen(env.port, () => console.log(`Buyer API listening on http://localhost:${env.port}`))).catch(error => { console.error('Database connection failed', error); process.exit(1); });
