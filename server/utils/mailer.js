import pool from '../con/db.js'

/**
 * Generate and record a secure 6-digit OTP code in MySQL otp_tokens
 */
export async function sendOTPEmail({ to, purpose = '2fa_login', entityType = 'user' }) {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    try {
      await pool`
        INSERT INTO otp_tokens (email, token, purpose, entity_type, expires_at, used)
        VALUES (${to}, ${code}, ${purpose}, ${entityType}, ${expiresAt}, FALSE)
      `
    } catch (dbErr) {
      console.warn('[mailer] Could not persist OTP to database:', dbErr.message)
    }

    if (process.env.NODE_ENV !== 'production') {
      console.log(`[mailer] ✓ OTP code generated for ${to} (${purpose}): ${code}`)
    }
    return { success: true, code }
  } catch (err) {
    console.error('[mailer] sendOTPEmail error:', err)
    return { success: false, error: err.message }
  }
}

/**
 * Verify a 6-digit OTP code against MySQL otp_tokens
 */
export async function verifyOTPEmail({ email, token, purpose = null }) {
  try {
    if (!email || !token) {
      return { success: false, error: 'Email and token required' }
    }

    // Explicit dev environment test override only when ALLOW_DEV_OTP is explicitly enabled
    if (process.env.NODE_ENV !== 'production' && process.env.ALLOW_DEV_OTP === 'true' && token === '123456') {
      return { success: true, data: { user: { email } } }
    }

    let rows;
    if (purpose) {
      rows = await pool`
        SELECT * FROM otp_tokens 
        WHERE email = ${email} 
          AND token = ${token}
          AND purpose = ${purpose}
          AND used = FALSE 
          AND expires_at > NOW()
        ORDER BY created_at DESC 
        LIMIT 1
      `
    } else {
      rows = await pool`
        SELECT * FROM otp_tokens 
        WHERE email = ${email} 
          AND token = ${token} 
          AND used = FALSE 
          AND expires_at > NOW()
        ORDER BY created_at DESC 
        LIMIT 1
      `
    }

    if (rows && rows.length > 0) {
      const match = rows[0]
      await pool`UPDATE otp_tokens SET used = TRUE WHERE id = ${match.id}`
      return { success: true, data: { user: { email }, tokenRecord: match } }
    }

    return { success: false, error: 'Invalid or expired OTP code' }
  } catch (err) {
    console.error('[mailer] verifyOTPEmail error:', err)
    return { success: false, error: err.message }
  }
}
