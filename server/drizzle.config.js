import { defineConfig } from 'drizzle-kit';
import dotenv from 'dotenv';
dotenv.config();

export default defineConfig({
  schema: './db/schema.js',
  out: './drizzle',
  dialect: 'mysql',
  dbCredentials: {
    url: process.env.MYSQL_URL || process.env.DATABASE_URL || 'mysql://root:@localhost:3306/lideta_db',
  },
});
