import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

if (process.env.NODE_ENV !== 'production') {
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  dotenv.config({ path: path.join(__dirname, '../.env.dev') });
}
