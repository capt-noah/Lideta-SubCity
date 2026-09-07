import multer from 'multer'
import path   from 'path'
import fs     from 'fs'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname  = path.dirname(__filename)

export const uploadBasePath = path.join(__dirname, '..', '..', 'client', 'public', 'uploads')

// Pre-create all standard upload subdirectories
const uploadSubdirs = ['admin_profiles', 'photos', 'videos', 'audios', 'cvs', 'documents']
if (!fs.existsSync(uploadBasePath)) {
  fs.mkdirSync(uploadBasePath, { recursive: true })
}
for (const sub of uploadSubdirs) {
  const fullSub = path.join(uploadBasePath, sub)
  if (!fs.existsSync(fullSub)) {
    fs.mkdirSync(fullSub, { recursive: true })
  }
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const subDirMap = {
      profile_picture: 'admin_profiles',
      video:           'videos',
      audio:           'audios',
      photo:           'photos',
      image:           'photos',
      cv:              'cvs',
      document:        'documents',
    }
    const subDir     = subDirMap[file.fieldname] || (file.mimetype.startsWith('image/') ? 'photos' : file.mimetype.startsWith('video/') ? 'videos' : file.mimetype.startsWith('audio/') ? 'audios' : file.mimetype === 'application/pdf' ? 'cvs' : 'documents')
    const targetPath = path.join(uploadBasePath, subDir)

    if (!fs.existsSync(targetPath)) fs.mkdirSync(targetPath, { recursive: true })
    cb(null, targetPath)
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const ext  = path.extname(file.originalname)
    const name = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9]/g, '_')
    cb(null, `${name}-${uniqueSuffix}${ext}`)
  },
})

export const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed =
      file.mimetype.startsWith('image/') ||
      file.mimetype.startsWith('video/') ||
      file.mimetype.startsWith('audio/') ||
      file.mimetype === 'application/pdf' ||
      file.mimetype === 'application/msword' ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'

    allowed
      ? cb(null, true)
      : cb(new Error('Only image, video, audio, PDF and Word files are allowed'), false)
  },
})
