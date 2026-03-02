const SIX_MONTHS_MS = 6 * 30 * 24 * 60 * 60 * 1000

export function isOverdue(asset) {
  if (!asset.last_maintenance_date) return true
  return Date.now() - new Date(asset.last_maintenance_date).getTime() > SIX_MONTHS_MS
}

export function daysOverdue(asset) {
  if (!asset.last_maintenance_date) return Infinity
  const diff = Date.now() - new Date(asset.last_maintenance_date).getTime() - SIX_MONTHS_MS
  return diff > 0 ? Math.ceil(diff / (24 * 60 * 60 * 1000)) : 0
}