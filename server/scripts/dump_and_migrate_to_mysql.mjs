import pool from '../con/db.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mysql from 'mysql2/promise';

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

function escapeSqlVal(val) {
  if (val === null || val === undefined) return 'NULL';
  if (typeof val === 'boolean') return val ? '1' : '0';
  if (typeof val === 'number') return String(val);
  if (val instanceof Date) {
    const pad = (n) => String(n).padStart(2, '0');
    return `'${val.getUTCFullYear()}-${pad(val.getUTCMonth() + 1)}-${pad(val.getUTCDate())} ${pad(val.getUTCHours())}:${pad(val.getUTCMinutes())}:${pad(val.getUTCSeconds())}'`;
  }
  if (Array.isArray(val) || (typeof val === 'object' && val !== null)) {
    const jsonStr = JSON.stringify(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
      switch (char) {
        case "\0": return "\\0";
        case "\x08": return "\\b";
        case "\x09": return "\\t";
        case "\x1a": return "\\z";
        case "\n": return "\\n";
        case "\r": return "\\r";
        case "\"": case "'": case "\\": case "%":
          return "\\" + char;
        default: return char;
      }
    });
    return `'${jsonStr}'`;
  }
  const escaped = String(val).replace(/[\0\x08\x09\x1a\n\r"'\\\%]/g, function (char) {
    switch (char) {
      case "\0": return "\\0";
      case "\x08": return "\\b";
      case "\x09": return "\\t";
      case "\x1a": return "\\z";
      case "\n": return "\\n";
      case "\r": return "\\r";
      case "\"": case "'": case "\\": case "%":
        return "\\" + char;
      default: return char;
    }
  });
  return `'${escaped}'`;
}

async function run() {
  console.log('--- 1. Extracting data from Supabase (PostgreSQL) ---');
  let ddlSql = '';
  if (fs.existsSync(migrationSqlPath)) {
    ddlSql = fs.readFileSync(migrationSqlPath, 'utf8');
  }

  let dumpContent = `-- MySQL Dump generated for Lideta Sub-City
-- Generated at: ${new Date().toISOString()}
-- Source: Supabase PostgreSQL -> Target: MySQL (Drizzle ORM)

CREATE DATABASE IF NOT EXISTS \`lideta_db\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE \`lideta_db\`;

SET FOREIGN_KEY_CHECKS = 0;

`;

  // Append DDL statements
  dumpContent += ddlSql + '\n\n';

  const tableData = {};
  for (const tableName of TABLES_ORDER) {
    try {
      const rows = await pool.unsafe(`SELECT * FROM "${tableName}"`);
      tableData[tableName] = rows;
      console.log(`[Supabase] ${tableName}: ${rows.length} records extracted.`);

      if (rows.length > 0) {
        dumpContent += `-- Data for table \`${tableName}\`\n`;
        const cols = Object.keys(rows[0]);
        const colsEscaped = cols.map(c => `\`${c}\``).join(', ');

        for (const row of rows) {
          const vals = cols.map(c => escapeSqlVal(row[c])).join(', ');
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
  console.log(`\n--- 2. MySQL Dump successfully saved to: ${dumpPath} (${(dumpContent.length / 1024).toFixed(2)} KB) ---`);

  // Try connecting to MySQL if MYSQL_URL is available
  const mysqlUrl = process.env.MYSQL_URL || process.env.MYSQL_DATABASE_URL;
  if (mysqlUrl) {
    try {
      console.log('\n--- 3. Direct MySQL import triggered via MYSQL_URL ---');
      const conn = await mysql.createConnection(mysqlUrl);
      console.log('Connected to MySQL server. Executing schema & data migration...');
      await conn.query(`CREATE DATABASE IF NOT EXISTS \`lideta_db\``);
      await conn.query(`USE \`lideta_db\``);
      
      const statements = dumpContent.split(';').map(s => s.trim()).filter(s => s.length > 0 && !s.startsWith('--'));
      for (const st of statements) {
        await conn.query(st);
      }
      console.log('All tables and records imported into MySQL successfully!');
      await conn.end();
    } catch (mErr) {
      console.log(`Note: Direct MySQL connection skipped or failed: ${mErr.message}`);
    }
  }

  process.exit(0);
}

run().catch(err => {
  console.error('Migration script error:', err);
  process.exit(1);
});
