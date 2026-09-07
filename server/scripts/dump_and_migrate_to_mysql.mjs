import postgres from 'postgres';
import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dumpPath = path.resolve(__dirname, '..', 'dump_mysql.sql');
const migrationSqlPath = path.resolve(__dirname, '..', 'drizzle', '0000_boring_mystique.sql');

const TABLES_ORDER = [
  'admins',
  'admin_settings',
  'activity_logs',
  'users',
  'otp_tokens',
  'complaints',
  'contacts',
  'news',
  'news_translation',
  'events',
  'events_translation',
  'vacancies',
  'vacancy_translation',
  'applicants',
  'service_satisfaction'
];

function formatValForSql(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `'${val.getUTCFullYear()}-${pad(val.getUTCMonth() + 1)}-${pad(val.getUTCDate())} ${pad(val.getUTCHours())}:${pad(val.getUTCMinutes())}:${pad(val.getUTCSeconds())}'`;
  }
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
    return mysql.escape(JSON.stringify(val));
  }
  return mysql.escape(String(val));
}

function formatValForParam(val) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'boolean') return val ? 1 : 0;
  if (Array.isArray(val) || (typeof val === 'object' && !(val instanceof Date))) {
    return JSON.stringify(val);
  }
  return val;
}

async function run() {
  console.log('--- 1. Connecting to Supabase (PostgreSQL) ---');
  const pgUrl = process.env.SUPABASE_DATABASE_URL || process.env.DATABASE_URL;
  if (!pgUrl) throw new Error('PostgreSQL / Supabase connection URL missing in process.env');

  const pgPool = postgres(pgUrl, { ssl: { rejectUnauthorized: false }, prepare: false });

  let ddlSql = '';
  if (fs.existsSync(migrationSqlPath)) {
    ddlSql = fs.readFileSync(migrationSqlPath, 'utf8')
      .replace(/--> statement-breakpoint/g, '')
      .replace(/CREATE TABLE /g, 'CREATE TABLE IF NOT EXISTS ');
  }

  let dumpContent = `-- MySQL Dump generated for Lideta Sub-City
-- Generated at: ${new Date().toISOString()}
-- Source: Supabase PostgreSQL -> Target: MySQL (Drizzle ORM)

CREATE DATABASE IF NOT EXISTS \`lideta_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`lideta_db\`;

SET FOREIGN_KEY_CHECKS = 0;

`;

  dumpContent += ddlSql + '\n\n';

  const stats = {};
  const tablesData = {};

  for (const tableName of TABLES_ORDER) {
    try {
      const rows = await pgPool.unsafe(`SELECT * FROM "${tableName}"`);
      stats[tableName] = rows.length;
      tablesData[tableName] = rows;
      console.log(`[Supabase] ${tableName}: ${rows.length} records extracted.`);

      if (rows.length > 0) {
        dumpContent += `-- Data for table \`${tableName}\`\n`;
        const cols = Object.keys(rows[0]);
        const colsEscaped = cols.map(c => `\`${c}\``).join(', ');

        for (const row of rows) {
          const vals = cols.map(c => formatValForSql(row[c])).join(', ');
          dumpContent += `INSERT INTO \`${tableName}\` (${colsEscaped}) VALUES (${vals});\n`;
        }
        dumpContent += '\n';
      }
    } catch (err) {
      console.warn(`[Warning] Could not extract table ${tableName}: ${err.message}`);
    }
  }

  dumpContent += 'SET FOREIGN_KEY_CHECKS = 1;\n';
  fs.writeFileSync(dumpPath, dumpContent, 'utf8');
  console.log(`\n--- 2. MySQL Dump saved to: ${dumpPath} (${(dumpContent.length / 1024).toFixed(2)} KB) ---`);

  // 3. Connect to MySQL server and import
  const mysqlHost = process.env.MYSQL_HOST || '127.0.0.1';
  const mysqlPort = Number(process.env.MYSQL_PORT) || 3306;
  const mysqlUser = process.env.MYSQL_USER || 'root';
  const mysqlPassword = process.env.MYSQL_PASSWORD || 'admin123';

  console.log(`\n--- 3. Connecting to local MySQL (${mysqlUser}@${mysqlHost}:${mysqlPort}) ---`);
  const conn = await mysql.createConnection({
    host: mysqlHost,
    port: mysqlPort,
    user: mysqlUser,
    password: mysqlPassword
  });

  console.log('Connected to MySQL. Creating `lideta_db` and tables...');
  await conn.query('CREATE DATABASE IF NOT EXISTS `lideta_db` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;');
  await conn.query('USE `lideta_db`;');
  await conn.query('SET FOREIGN_KEY_CHECKS = 0;');

  for (const t of TABLES_ORDER) {
    await conn.query(`DROP TABLE IF EXISTS \`${t}\`;`);
  }

  // Run DDL statements
  const ddlStatements = ddlSql.split(';').map(s => s.trim()).filter(s => s.length > 0);
  for (const st of ddlStatements) {
    await conn.query(st);
  }
  console.log('Tables created successfully in MySQL!');

  // Parameterized batch insert
  for (const tableName of TABLES_ORDER) {
    const rows = tablesData[tableName] || [];
    if (rows.length === 0) continue;

    const cols = Object.keys(rows[0]);
    const colsEscaped = cols.map(c => `\`${c}\``).join(', ');
    const placeholders = cols.map(() => '?').join(', ');
    const insertQuery = `INSERT INTO \`${tableName}\` (${colsEscaped}) VALUES (${placeholders})`;

    for (const row of rows) {
      const params = cols.map(c => formatValForParam(row[c]));
      await conn.query(insertQuery, params);
    }
    console.log(`  Inserted ${rows.length} rows into \`${tableName}\``);
  }

  await conn.query('SET FOREIGN_KEY_CHECKS = 1;');
  console.log('All data imported into local MySQL successfully!');

  // Verify record counts in MySQL
  console.log('\n--- 4. Verifying MySQL vs Supabase Record Counts ---');
  let allMatched = true;
  for (const tableName of TABLES_ORDER) {
    try {
      const [rows] = await conn.query(`SELECT COUNT(*) as cnt FROM \`${tableName}\``);
      const myCount = rows[0].cnt;
      const pgCount = stats[tableName] || 0;
      const matched = myCount === pgCount;
      if (!matched) allMatched = false;
      const status = matched ? '✓ MATCH' : '✗ MISMATCH';
      console.log(`  ${tableName.padEnd(22)} : Supabase = ${String(pgCount).padStart(3)} | MySQL = ${String(myCount).padStart(3)}  ${status}`);
    } catch (e) {
      console.log(`  ${tableName.padEnd(22)} : Error checking count: ${e.message}`);
    }
  }

  await conn.end();
  await pgPool.end();

  if (allMatched) {
    console.log('\n🎉 ALL 15 TABLES AND RECORDS PERFECTLY MIGRATED AND VERIFIED ON LOCAL MYSQL!');
  }

  process.exit(0);
}

run().catch(err => {
  console.error('Migration error:', err);
  process.exit(1);
});
