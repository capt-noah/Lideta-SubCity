import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || '10.180.50.142',
  port:     Number(process.env.DB_PORT) || 3306,
  user:     process.env.DB_USER     || 'lideta_admin',
  password: process.env.DB_PASSWORD || 'TysZs~Bjp9?xbd09',
  database: process.env.DB_NAME     || process.env.DATABASE || 'lideta_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool, schema };
export default db;
