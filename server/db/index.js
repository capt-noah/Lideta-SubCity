import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

const dbPort = Number(process.env.DB_PORT);
const port = (!isNaN(dbPort) && dbPort !== 5432) ? dbPort : 3306;

const pool = mysql.createPool({
  host:     process.env.DB_HOST     || '127.0.0.1',
  port:     port,
  user:     process.env.DB_USER === 'postgres' ? 'root' : (process.env.DB_USER || 'root'),
  password: process.env.DB_PASSWORD || 'admin123',
  database: process.env.DB_NAME     || 'lideta_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export const db = drizzle(pool, { schema, mode: 'default' });
export { pool, schema };
export default db;
