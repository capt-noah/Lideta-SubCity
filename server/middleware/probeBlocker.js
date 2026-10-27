/**
 * Sensitive File & Probe Blocker Middleware
 * Prevents scanner false positives (CWE-530) and sensitive file enumeration
 * by returning an immediate 404 (Not Found) for backup, cert, database, config,
 * and executable extensions before static routing or SPA fallback.
 */

// Extensions and patterns commonly probed by Nikto / scanners
const BLOCKED_EXTENSIONS_REGEX = /\.(tgz|tar|tar\.gz|tar\.bz2|tar\.lzma|alz|egg|war|ear|zip|rar|7z|bak|old|swp|backup|dump|orig|save|cer|crt|pem|key|jks|pfx|p12|der|csr|sql|db|sqlite|sqlite3|env.*|yml|yaml|ini|conf|config|toml|git.*|svn.*|hg.*|ds_store|thumbs\.db|php|asp|aspx|jsp|cgi|action|do|pl|sh|exe|bat)$/i

// Probed dotfiles and sensitive root paths
const BLOCKED_PATHS_REGEX = /^(\/\.env|\/\.git|\/\.svn|\/\.hg|\/\.well-known\/(?!acme-challenge)|\/\.aws|\/\.ssh|\/\.docker|\/\.config|\/wp-admin|\/wp-login|\/phpmyadmin|\/pma|\/adminer|\/webmail|\/cpanel|\/server-status|\/server-info)/i

export function probeBlocker(req, res, next) {
  const urlPath = (req.path || '').toLowerCase()
  const rawUrl  = (req.originalUrl || req.url || '').toLowerCase()

  // 1. Check if path or raw URL matches sensitive extensions
  if (BLOCKED_EXTENSIONS_REGEX.test(urlPath) || BLOCKED_EXTENSIONS_REGEX.test(rawUrl.split('?')[0])) {
    return res.status(404).set('Cache-Control', 'no-store').json({ error: 'Not Found' })
  }

  // 2. Check if path matches known sensitive directory / dotfile probes
  if (BLOCKED_PATHS_REGEX.test(urlPath) || BLOCKED_PATHS_REGEX.test(rawUrl)) {
    return res.status(404).set('Cache-Control', 'no-store').json({ error: 'Not Found' })
  }

  next()
}

export default probeBlocker
