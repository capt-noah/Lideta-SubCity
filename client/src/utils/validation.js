/**
 * Shared form validators used across UserAuth, Admin Login, and SuperAdmin forms.
 * Each returns { isValid: boolean, message: string }
 */

// ─── Ethiopian phone number ───────────────────────────────────────────────────
// Valid formats:
//   09XXXXXXXX  (10 digits, starts with 09)
//   07XXXXXXXX  (10 digits, starts with 07)
//   +2519XXXXXXXX (13 chars)
//   +2517XXXXXXXX (13 chars)
const ET_PHONE_RE = /^(\+251(9|7)\d{8}|0(9|7)\d{8})$/

export function validateEthiopianPhone(value) {
  if (!value || !value.trim()) {
    return { isValid: false, message: 'Phone number is required.' }
  }
  // Strip spaces and dashes before testing
  const cleaned = value.trim().replace(/[\s\-]/g, '')
  if (!ET_PHONE_RE.test(cleaned)) {
    return {
      isValid: false,
      message: 'Enter a valid Ethiopian phone number (e.g. 0912345678 or +251912345678).',
    }
  }
  return { isValid: true, message: '' }
}

// Optional version — empty is allowed, but if provided must be valid ET format
export function validateEthiopianPhoneOptional(value) {
  if (!value || !value.trim()) return { isValid: true, message: '' }
  return validateEthiopianPhone(value)
}

// ─── Name (first / last) ─────────────────────────────────────────────────────
const NAME_RE = /^[A-Za-z\u00C0-\u024F\u1200-\u137F\s'\-]+$/

export function validateName(value, fieldLabel = 'Name') {
  if (!value || !value.trim()) {
    return { isValid: false, message: `${fieldLabel} is required.` }
  }
  if (value.trim().length < 2) {
    return { isValid: false, message: `${fieldLabel} must be at least 2 characters.` }
  }
  if (value.trim().length > 60) {
    return { isValid: false, message: `${fieldLabel} must be under 60 characters.` }
  }
  if (!NAME_RE.test(value.trim())) {
    return { isValid: false, message: `${fieldLabel} can only contain letters, spaces, hyphens, and apostrophes.` }
  }
  return { isValid: true, message: '' }
}

// ─── Username ─────────────────────────────────────────────────────────────────
const USERNAME_RE = /^[A-Za-z0-9_\-]+$/

export function validateUsername(value) {
  if (!value || !value.trim()) {
    return { isValid: false, message: 'Username is required.' }
  }
  if (value.trim().length < 3) {
    return { isValid: false, message: 'Username must be at least 3 characters.' }
  }
  if (value.trim().length > 30) {
    return { isValid: false, message: 'Username must be under 30 characters.' }
  }
  if (!USERNAME_RE.test(value.trim())) {
    return { isValid: false, message: 'Username can only contain letters, numbers, underscores, and hyphens.' }
  }
  return { isValid: true, message: '' }
}

// ─── Email ────────────────────────────────────────────────────────────────────
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateEmail(value) {
  if (!value || !value.trim()) {
    return { isValid: false, message: 'Email is required.' }
  }
  if (!EMAIL_RE.test(value.trim())) {
    return { isValid: false, message: 'Enter a valid email address.' }
  }
  return { isValid: true, message: '' }
}

// ─── Password match ───────────────────────────────────────────────────────────
export function validatePasswordMatch(password, confirm) {
  if (!confirm) return { isValid: false, message: 'Please confirm your password.' }
  if (password !== confirm) return { isValid: false, message: 'Passwords do not match.' }
  return { isValid: true, message: '' }
}
