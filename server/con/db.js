import dotenv from 'dotenv'
import { pool as mysqlRawPool } from '../db/index.js'
import { createMysqlPoolAdapter } from './mysqlAdapter.js'

dotenv.config()

const pool = createMysqlPoolAdapter(mysqlRawPool);

export default pool;
