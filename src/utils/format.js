/**
 * Shared formatting utilities
 * Date display uses Buddhist Era (พ.ศ.) — add 543 to Gregorian year
 */

/**
 * Format an ISO date string (YYYY-MM-DD) to Thai display format DD/MM/YYYY (พ.ศ.)
 * @param {string|null} dateStr
 * @returns {string}
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const d = new Date(dateStr + 'T00:00:00') // force local-time parse
  if (isNaN(d.getTime())) return dateStr
  const day   = String(d.getDate()).padStart(2, '0')
  const month = String(d.getMonth() + 1).padStart(2, '0')
  const year  = d.getFullYear() + 543
  return `${day}/${month}/${year}`
}

/**
 * Format a number as Thai Baht currency (2 decimal places)
 * @param {number|string|null} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return '-'
  const num = Number(amount)
  if (isNaN(num)) return '-'
  return new Intl.NumberFormat('th-TH', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num)
}

/**
 * Format a YYYY-MM string into Thai month-year label, e.g. "มี.ค. 2568"
 * @param {string} monthStr  e.g. "2025-03"
 * @returns {string}
 */
export function formatMonthYear(monthStr) {
  if (!monthStr) return '-'
  const [yearStr, monthStr2] = monthStr.split('-')
  if (!yearStr || !monthStr2) return monthStr
  const thaiYear = parseInt(yearStr, 10) + 543
  const monthNames = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.',
    'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.',
    'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.',
  ]
  const idx = parseInt(monthStr2, 10) - 1
  return `${monthNames[idx] ?? monthStr2} ${thaiYear}`
}

/**
 * Parse a date string from CSV (handles Buddhist calendar and common Thai formats)
 * Returns an ISO string YYYY-MM-DD suitable for Supabase, or null on failure.
 * @param {string} raw
 * @returns {string|null}
 */
export function parseCsvDate(raw) {
  if (!raw) return null
  const s = String(raw).trim()

  // Already ISO: YYYY-MM-DD
  const iso = s.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (iso) {
    const y = parseInt(iso[1], 10)
    const gregorian = y > 2500 ? y - 543 : y
    return `${gregorian}-${iso[2]}-${iso[3]}`
  }

  // DD/MM/YYYY or DD-MM-YYYY
  const dmy = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/)
  if (dmy) {
    const y = parseInt(dmy[3], 10)
    const gregorian = y > 2500 ? y - 543 : y
    return `${gregorian}-${String(dmy[2]).padStart(2, '0')}-${String(dmy[1]).padStart(2, '0')}`
  }

  // YYYY/MM/DD
  const ymd = s.match(/^(\d{4})\/(\d{2})\/(\d{2})$/)
  if (ymd) {
    const y = parseInt(ymd[1], 10)
    const gregorian = y > 2500 ? y - 543 : y
    return `${gregorian}-${ymd[2]}-${ymd[3]}`
  }

  return null
}

/**
 * Parse a numeric value from a CSV string (strips commas, handles Thai decimals)
 * @param {string|number|null} raw
 * @returns {number|null}
 */
export function parseCsvNumber(raw) {
  if (raw === null || raw === undefined || raw === '') return null
  const cleaned = String(raw).replace(/,/g, '').trim()
  const num = parseFloat(cleaned)
  return isNaN(num) ? null : num
}
