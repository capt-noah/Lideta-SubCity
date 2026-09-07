import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import fs from 'fs'
import path    from 'path'
import { fileURLToPath } from 'url'

import corsMiddleware from './middleware/cors.js'
import logger         from './middleware/logger.js'

import authRouter       from './routes/auth.js'
import userRouter       from './routes/user.js'
import adminRouter      from './routes/admin.js'
import superadminRouter from './routes/superadmin.js'
import newsRouter       from './routes/news.js'
import eventsRouter     from './routes/events.js'
import vacanciesRouter  from './routes/vacancies.js'
import complaintsRouter from './routes/complaints.js'
import contactsRouter   from './routes/contacts.js'
import { upload, uploadBasePath } from './middleware/upload.js'

const app        = express()
const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)
const distPath   = path.join(__dirname, '..', 'client', 'dist')
const indexPath  = path.join(distPath, 'index.html')

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(express.json())
app.use(corsMiddleware)
app.use(logger)

import { pool as mysqlPool } from './db/index.js'

// ── Health check & Diagnostics ───────────────────────────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({
    ok: true,
    message: 'Server is running',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development',
  })
})

app.get('/api/db-test', async (req, res) => {
  try {
    const [rows] = await mysqlPool.query('SELECT 1 + 1 AS result, NOW() as server_time')
    const [tables] = await mysqlPool.query('SHOW TABLES')
    res.json({
      status: 'connected',
      test: rows[0],
      tables: tables.map(t => Object.values(t)[0]),
      host: process.env.DB_HOST || '10.180.50.142',
      database: process.env.DB_NAME || 'lideta_db',
    })
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
      code: err.code,
      host: process.env.DB_HOST || '10.180.50.142',
    })
  }
})

// ── Static files ──────────────────────────────────────────────────────────────
app.use(express.static(distPath))
app.use('/uploads', express.static(uploadBasePath))

// ── Universal Upload Endpoints ───────────────────────────────────────────────
app.post('/api/upload', upload.any(), (req, res) => {
  if (!req.files?.length) return res.status(400).json({ error: 'No file uploaded' })
  const file = req.files[0]
  const subDirMap = { profile_picture: 'admin_profiles/', video: 'videos/', audio: 'audios/', photo: 'photos/', image: 'photos/', cv: 'cvs/' }
  const dir = subDirMap[file.fieldname] || (file.mimetype.startsWith('image/') ? 'photos/' : file.mimetype.startsWith('video/') ? 'videos/' : file.mimetype.startsWith('audio/') ? 'audios/' : file.mimetype === 'application/pdf' ? 'cvs/' : '')
  res.json({ name: file.originalname, path: `/uploads/${dir}${file.filename}`, size: file.size, mimetype: file.mimetype })
})

app.post('/api/upload-cv', upload.single('cv'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No CV file uploaded' })
  res.json({ path: `/uploads/cvs/${req.file.filename}` })
})

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/auth',              authRouter)         // /auth/admin/login, /auth/user/login, etc.
app.use('/api/auth',          authRouter)         // /api/auth/verify-otp, /api/auth/resend-otp, etc.
app.use('/api/user',          userRouter)         // /api/user/me, /api/user/dashboard, etc.
app.use('/api/admin',         adminRouter)        // /api/admin/activities, settings, profile, etc.
app.use('/api/superadmin',    superadminRouter)   // /api/superadmin/admins, overview, etc.
app.use('/api/news',          newsRouter)         // /api/news (public) + /api/news/admin (protected)
app.use('/api/events',        eventsRouter)       // /api/events (public) + /api/events/admin (protected)
app.use('/api/vacancies',     vacanciesRouter)    // /api/vacancies (public) + /api/vacancies/admin, etc.
app.use('/api/complaints',    complaintsRouter)   // /api/complaints (public) + /api/complaints/admin, etc.
app.use('/api/complaint-types', complaintsRouter) // /api/complaint-types → complaints/types
app.use('/api/contacts',      contactsRouter)     // /api/contacts (public) + /api/contacts/admin, etc.
app.use('/api/service-satisfaction', contactsRouter) // /api/service-satisfaction

// ── SPA fallback — React Router handles all non-API routes ───────────────────
app.use((req, res, next) => {
  if (
    req.path.startsWith('/api/') ||
    req.path.startsWith('/auth/') ||
    req.path.startsWith('/uploads/')
  ) return next()
  res.sendFile(indexPath)
})

// ── Start ─────────────────────────────────────────────────────────────────────
const port = process.env.PORT || process.env.SERVER_PORT

console.log(`[server] NODE_ENV     : ${process.env.NODE_ENV || 'development'}`)
console.log(`[server] PORT         : ${port || '✗ MISSING'}`)
console.log(`[server] DIST PATH    : ${distPath}`)
console.log(`[server] INDEX PATH   : ${indexPath}`)
console.log(`[server] INDEX EXISTS : ${fs.existsSync(indexPath) ? '✓ FOUND' : '✗ MISSING'}`)
console.log(`[server] DATABASE_URL : ${process.env.DATABASE_URL ? '✓' : '✗ MISSING'}`)
console.log(`[server] JWT_SECRET   : ${process.env.JWT_SECRET  ? '✓' : '✗ MISSING'}`)

if (!port) {
  throw new Error('PORT is missing. Plesk must provide the app port.')
}

app.listen(Number(port), () => {
  console.log(`[server] ✓ Listening on port: ${Number(port)}`)
})
