import mysql from 'mysql2/promise';

function translatePgToMysql(sql) {
  let q = sql;

  // 1. Convert RETURNING clause
  // Handled outside for insertId extraction

  // 2. Convert TO_CHAR(x, 'Mon DD, YYYY') -> DATE_FORMAT(x, '%b %d, %Y')
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]Mon DD, YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%b %d, %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]Dy\. Mon, DD YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%a. %b, %d %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]DY, Mon DD YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%a, %b %d %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]DD\/MM\/YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%d/%m/%Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"][^'"]+['"]\s*\)/gi, "DATE_FORMAT($1, '%Y-%m-%d')");

  // 3. Convert COUNT(*) FILTER (WHERE condition) -> COUNT(CASE WHEN condition THEN 1 END)
  q = q.replace(/COUNT\s*\(\s*\*\s*\)\s+FILTER\s*\(\s*WHERE\s+([^)]+)\)/gi, 'COUNT(CASE WHEN $1 THEN 1 END)');

  // 4. Convert type casts ::jsonb, ::json, ::text, etc.
  q = q.replace(/::jsonb/gi, '');
  q = q.replace(/::json/gi, '');
  q = q.replace(/::text/gi, '');

  // 5. Convert ILIKE -> LIKE
  q = q.replace(/\bILIKE\b/gi, 'LIKE');

  // 6. Convert NOW() or CURRENT_TIMESTAMP
  return q;
}

export function createMysqlPoolAdapter(configOrUrl) {
  let pool;
  if (typeof configOrUrl === 'string') {
    pool = mysql.createPool(configOrUrl);
  } else {
    pool = mysql.createPool({
      host: configOrUrl.host || '127.0.0.1',
      port: Number(configOrUrl.port) || 3306,
      user: configOrUrl.user || 'root',
      password: configOrUrl.password || 'admin123',
      database: configOrUrl.database || 'lideta_db',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }

  // Tagged template function emulator for MySQL compatible with postgres.js syntax
  const sql = async function (strings, ...args) {
    if (typeof strings === 'string') {
      const [rows] = await pool.query(translatePgToMysql(strings), args);
      return rows;
    }

    let query = '';
    const params = [];

    for (let i = 0; i < strings.length; i++) {
      query += strings[i];
      if (i < args.length) {
        const arg = args[i];
        if (arg && typeof arg === 'object' && arg.__isJson) {
          query += '?';
          params.push(JSON.stringify(arg.value));
        } else if (arg && typeof arg === 'object' && arg.__isRaw) {
          query += arg.value;
        } else {
          query += '?';
          params.push(arg === undefined ? null : arg);
        }
      }
    }

    // Convert Postgres RETURNING clause for MySQL compatibility
    const returningMatch = query.match(/RETURNING\s+([a-zA-Z0-9_,\s*]+)$/i);
    let cleanQuery = query;
    let returningCol = null;

    if (returningMatch) {
      returningCol = returningMatch[1].trim();
      cleanQuery = query.replace(/RETURNING\s+([a-zA-Z0-9_,\s*]+)$/i, '').trim();
    }

    cleanQuery = translatePgToMysql(cleanQuery);

    const [result] = await pool.query(cleanQuery, params);

    if (returningCol && result && result.insertId) {
      const row = { [returningCol]: result.insertId, id: result.insertId, complaint_id: result.insertId, count: result.affectedRows };
      const arr = [row];
      arr.count = result.affectedRows;
      return arr;
    }

    if (Array.isArray(result)) {
      result.count = result.length;
      return result;
    }

    const resArr = [];
    resArr.count = result?.affectedRows || 0;
    resArr.insertId = result?.insertId || 0;
    return resArr;
  };

  sql.json = (val) => ({ __isJson: true, value: val });
  sql.unsafe = async (rawStr, params = []) => {
    const [rows] = await pool.query(translatePgToMysql(rawStr), params);
    return rows;
  };
  sql.rawPool = pool;

  return sql;
}
