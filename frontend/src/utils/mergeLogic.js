const TOLERANCE = 0.00001

export function isSameLocation(lat1, lng1, lat2, lng2) {
  return Math.abs(lat1 - lat2) < TOLERANCE && Math.abs(lng1 - lng2) < TOLERANCE
}

export function findByLocation(assets, lat, lng) {
  return assets.find(a => isSameLocation(a.lat, lat, a.lng, lng))
}

export function mergeAsset(existing, incoming) {
  return { ...existing, ...incoming, id: existing.id, lat: existing.lat, lng: existing.lng }
}

export function upsertLocal(assets, incoming) {
  const existing = incoming.id
    ? assets.find(a => a.id === incoming.id)
    : findByLocation(assets, incoming.lat, incoming.lng)

  if (existing) {
    const merged = mergeAsset(existing, incoming)
    return assets.map(a => (a.id === existing.id ? merged : a))
  }
  return [...assets, { ...incoming, id: crypto.randomUUID() }]
}