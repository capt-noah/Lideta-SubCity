/**
 * Comprehensive HTTP Security Headers & Information Disclosure Hardening
 * Mitigates CWE-1021 (Clickjacking), CWE-319 (Missing HSTS), CWE-79 (MIME sniffing),
 * CWE-200 (Information Disclosure), and establishes Content-Security-Policy.
 */

export function securityHeaders(req, res, next) {
  // 1. Anti-Clickjacking (CWE-1021)
  res.setHeader('X-Frame-Options', 'SAMEORIGIN')

  // 2. HTTP Strict Transport Security (HSTS - CWE-319) — 1 year + subdomains + preload
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // 3. Prevent MIME type sniffing (CWE-79, CWE-116)
  res.setHeader('X-Content-Type-Options', 'nosniff')

  // 4. Referrer Policy
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')

  // 5. Cross-Site Scripting Filter Protection
  res.setHeader('X-XSS-Protection', '1; mode=block')

  // 6. Permissions Policy (Restrict sensitive browser features)
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=(), payment=()')

  // 7. Cross-Origin Policies
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin')

  // 8. Content Security Policy (CSP)
  const cspDirectives = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
    "font-src 'self' https://fonts.gstatic.com data:",
    "img-src 'self' data: https: blob: http:",
    "media-src 'self' data: https: blob: http:",
    "connect-src 'self' https: http: wss: ws:",
    "frame-src 'self' https://www.google.com https://maps.google.com https://*.google.com",
    "frame-ancestors 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
  ]
  res.setHeader('Content-Security-Policy', cspDirectives.join('; '))

  next()
}

export function stripServerHeaders(req, res, next) {
  // Disable X-Powered-By and strip server identifiers
  res.removeHeader('X-Powered-By')
  res.removeHeader('Server')
  res.removeHeader('X-AspNet-Version')
  res.removeHeader('X-Runtime')
  res.removeHeader('X-Passenger-Version')

  // Intercept writeHead to ensure stripped headers don't leak through proxy layers
  const originalWriteHead = res.writeHead
  res.writeHead = function (...args) {
    res.removeHeader('X-Powered-By')
    res.removeHeader('Server')
    return originalWriteHead.apply(this, args)
  }

  next()
}

export default { securityHeaders, stripServerHeaders }
