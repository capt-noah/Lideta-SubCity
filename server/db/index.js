import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import * as schema from './schema.js';
import dotenv from 'dotenv';
dotenv.config();

let connectionPool;
let db;

try {
  const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_DATABASE_URL;
  if (mysqlUrl) {
    connectionPool = mysql.createPool(mysqlUrl);
  } else {
    connectionPool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'lideta_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  db = drizzle(connectionPool, { schema, mode: 'default' });
  console.log('[drizzle-mysql] Initialized Drizzle MySQL pool');
} catch (err) {
  console.warn('[drizzle-mysql] Failed to initialize connection pool:', err.message);
}

export { db, connectionPool, schema };
export default db;
