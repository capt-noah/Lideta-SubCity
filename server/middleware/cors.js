import cors from 'cors'

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://lideta-official.vercel.app',
  'https://lidetasubcity.gov.et',
  'https://www.lidetasubcity.gov.et',
  process.env.CLIENT_ORIGIN,
].filter(Boolean)

export default cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true)

    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)
    const isGovSubdomain = /^https:\/\/[a-zA-Z0-9-]+\.lidetasubcity\.gov\.et$/.test(origin)

    if (
      allowedOrigins.includes(origin) ||
      isLocalhost ||
      isGovSubdomain ||
      origin.endsWith('.run.app') ||
      origin.endsWith('.googleusercontent.com')
    ) {
      return callback(null, true)
    }

    console.warn(`[cors] Blocked origin: ${origin}`)
    callback(new Error(`CORS: origin ${origin} not allowed`))
  },
  credentials: true,
})
