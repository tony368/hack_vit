import { isOverdue } from './overdueCheck'

export function aggregateByCondition(assets) {
  const c = {}
  assets.forEach(a => { c[a.condition] = (c[a.condition] || 0) + 1 })
  return Object.entries(c).map(([name, value]) => ({ name, value }))
}

export function aggregateByType(assets) {
  const c = {}
  assets.forEach(a => { c[a.type] = (c[a.type] || 0) + 1 })
  return Object.entries(c).map(([name, count]) => ({ name, count }))
}

export function aggregateMaintenanceByMonth(assets) {
  const c = {}
  assets.forEach(a => {
    if (!a.last_maintenance_date) return
    const d   = new Date(a.last_maintenance_date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    c[key] = (c[key] || 0) + 1
  })
  return Object.entries(c)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-12)
    .map(([month, count]) => ({ month, count }))
}

export function getSummaryStats(assets) {
  return {
    total:     assets.length,
    overdue:   assets.filter(isOverdue).length,
    critical:  assets.filter(a => a.condition === 'Critical').length,
    good:      assets.filter(a => a.condition === 'Good').length,
    defective: assets.filter(a => a.condition === 'Defective').length,
  }
}