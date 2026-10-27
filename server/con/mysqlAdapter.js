import mysql from 'mysql2/promise';

function translatePgToMysql(sql) {
  let q = sql;

  // 1. Convert TO_CHAR(x, 'Mon DD, YYYY') -> DATE_FORMAT(x, '%b %d, %Y')
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]Mon DD, YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%b %d, %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]Dy\. Mon, DD YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%a. %b, %d %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]DY, Mon DD YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%a, %b %d %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]DD\/MM\/YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%d/%m/%Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"]DD\s*-\s*MM\s*-\s*YYYY['"]\s*\)/gi, "DATE_FORMAT($1, '%d - %m - %Y')");
  q = q.replace(/TO_CHAR\s*\(\s*([^,]+)\s*,\s*['"][^'"]+['"]\s*\)/gi, "DATE_FORMAT($1, '%Y-%m-%d')");

  // 2. Convert PostgreSQL INTERVAL '30 days' / '1 month' -> MySQL INTERVAL 30 DAY / 1 MONTH
  q = q.replace(/INTERVAL\s+['"](\d+)\s*days?['"]/gi, 'INTERVAL $1 DAY');
  q = q.replace(/INTERVAL\s+['"](\d+)\s*months?['"]/gi, 'INTERVAL $1 MONTH');
  q = q.replace(/INTERVAL\s+['"](\d+)\s*years?['"]/gi, 'INTERVAL $1 YEAR');
  q = q.replace(/INTERVAL\s+['"](\d+)\s*hours?['"]/gi, 'INTERVAL $1 HOUR');

  // 3. Convert COUNT(*) FILTER (WHERE condition) -> COUNT(CASE WHEN condition THEN 1 END)
  const filterRegex = /COUNT\s*\(\s*\*\s*\)\s+FILTER\s*\(\s*WHERE\s+/gi;
  let match;
  let filteredSql = '';
  let lastIdx = 0;
  while ((match = filterRegex.exec(q)) !== null) {
    filteredSql += q.slice(lastIdx, match.index);
    const startOfCond = filterRegex.lastIndex;
    let depth = 1;
    let i = startOfCond;
    while (i < q.length && depth > 0) {
      if (q[i] === '(') depth++;
      else if (q[i] === ')') depth--;
      i++;
    }
    const cond = q.slice(startOfCond, i - 1);
    filteredSql += `COUNT(CASE WHEN ${cond} THEN 1 END)`;
    lastIdx = i;
    filterRegex.lastIndex = i;
  }
  filteredSql += q.slice(lastIdx);
  q = filteredSql;

  // 4. Convert type casts ::jsonb, ::json, ::text, etc.
  q = q.replace(/::jsonb/gi, '');
  q = q.replace(/::json/gi, '');
  q = q.replace(/::text/gi, '');

  // 5. Convert ILIKE -> LIKE
  q = q.replace(/\bILIKE\b/gi, 'LIKE');

  return q;
}

export function createMysqlPoolAdapter(poolOrConfig) {
  let pool;
  if (poolOrConfig && typeof poolOrConfig.query === 'function') {
    pool = poolOrConfig;
  } else {
    pool = mysql.createPool({
      host:     poolOrConfig?.host     || process.env.DB_HOST     || '10.180.50.142',
      port:     Number(poolOrConfig?.port || process.env.DB_PORT) || 3306,
      user:     poolOrConfig?.user     || process.env.DB_USER     || 'lideta_admin',
      password: poolOrConfig?.password || process.env.DB_PASSWORD || 'TysZs~Bjp9?xbd09',
      database: poolOrConfig?.database || process.env.DB_NAME     || 'lideta_db',
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
        } else if (Array.isArray(arg)) {
          // Serialize plain arrays to JSON strings when binding to MySQL parameters
          query += '?';
          params.push(JSON.stringify(arg));
        } else if (arg !== null && typeof arg === 'object' && !(arg instanceof Date) && !Buffer.isBuffer(arg)) {
          // Serialize plain objects (e.g. translation bags, metadata) to JSON strings
          query += '?';
          params.push(JSON.stringify(arg));
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

    if (returningCol && result) {
      const insertId = result.insertId || 0;
      const row = {
        [returningCol]: insertId,
        id: insertId,
        complaint_id: insertId,
        events_id: insertId,
        admin_id: insertId,
        count: result.affectedRows || 0
      };
      const arr = [row];
      arr.count = result.affectedRows || 0;
      arr.insertId = insertId;
      arr.affectedRows = result.affectedRows || 0;
      return arr;
    }

    if (Array.isArray(result)) {
      result.count = result.length;
      return result;
    }

    const resArr = [];
    resArr.count = result?.affectedRows || 0;
    resArr.insertId = result?.insertId || 0;
    resArr.affectedRows = result?.affectedRows || 0;
    return resArr;
  };

  sql.json = (val) => ({ __isJson: true, value: val });
  sql.raw = (val) => ({ __isRaw: true, value: val });
  sql.unsafe = async (rawStr, params = []) => {
    const [rows] = await pool.query(translatePgToMysql(rawStr), params);
    return rows;
  };
  sql.rawPool = pool;

  return sql;
}

export default createMysqlPoolAdapter;
