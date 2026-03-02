import { useEffect, useRef } from 'react'
import L from 'leaflet'
import { isOverdue } from '../utils/overdueCheck'

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const mkIcon = color => L.divIcon({
  className: '',
  html: `<div style="width:14px;height:14px;background:${color};border:2.5px solid rgba(255,255,255,.92);border-radius:50%;box-shadow:0 0 0 3px ${color}44,0 2px 10px rgba(0,0,0,.5)"></div>`,
  iconSize: [14, 14], iconAnchor: [7, 7], popupAnchor: [0, -10],
})

const ICONS = {
  Good:      mkIcon('#0fba7d'),
  Defective: mkIcon('#f0a429'),
  Critical:  mkIcon('#f04545'),
  Overdue:   mkIcon('#f04545'),
}

function buildPopup(asset, onEdit, onDelete) {
  const overdue   = isOverdue(asset)
  const condColor = { Good: '#0fba7d', Defective: '#f0a429', Critical: '#f04545' }[asset.condition] || '#888'
  const el = document.createElement('div')
  el.style.fontFamily = "'Satoshi','TT Norms Pro',sans-serif"
  el.style.minWidth   = '210px'
  el.innerHTML = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:9px">
      <strong style="font-size:14px;color:#0f172a;font-weight:800;letter-spacing:-.02em">${asset.type}</strong>
      ${overdue ? `<span style="background:#fee2e2;color:#dc2626;font-size:9.5px;padding:2px 8px;border-radius:999px;font-weight:800">OVERDUE</span>` : ''}
    </div>
    <div style="font-size:12px;color:#475569;line-height:1.9;font-weight:500">
      <div>Condition: <span style="color:${condColor};font-weight:800">${asset.condition}</span></div>
      ${asset.status ? `<div>Status: ${asset.status}</div>` : ''}
      ${asset.zone   ? `<div>Zone: ${asset.zone}</div>`     : ''}
      <div style="font-size:10px;color:#94a3b8;font-family:monospace;margin-top:2px">${(+asset.lat).toFixed(5)}, ${(+asset.lng).toFixed(5)}</div>
      <div>${asset.last_maintenance_date ? `Last: ${asset.last_maintenance_date}` : '<span style="color:#ef4444">Never maintained</span>'}</div>
    </div>
    <div style="display:flex;gap:8px;margin-top:11px">
      <button id="pop-edit"   style="flex:1;background:#1d4ed8;color:#fff;border:none;padding:8px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Edit</button>
      <button id="pop-delete" style="flex:1;background:#fee2e2;color:#dc2626;border:none;padding:8px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;font-family:inherit">Delete</button>
    </div>`
  el.querySelector('#pop-edit').addEventListener('click',   () => onEdit(asset))
  el.querySelector('#pop-delete').addEventListener('click', () => onDelete(asset.id))
  return el
}

export default function MapView({ assets, onMapClick, onEdit, onDelete }) {
  const containerRef = useRef(null)
  const mapRef       = useRef(null)
  const layerRef     = useRef(null)

  useEffect(() => {
    if (mapRef.current) return
    mapRef.current   = L.map(containerRef.current).setView([51.505, -0.09], 13)
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO', maxZoom: 19,
    }).addTo(mapRef.current)
    layerRef.current = L.layerGroup().addTo(mapRef.current)
    return () => { mapRef.current?.remove(); mapRef.current = null }
  }, [])

  useEffect(() => {
    if (!mapRef.current) return
    mapRef.current.off('click')
    mapRef.current.on('click', e => onMapClick(e.latlng))
  }, [onMapClick])

  useEffect(() => {
    if (!layerRef.current) return
    layerRef.current.clearLayers()
    assets.forEach(asset => {
      const icon   = isOverdue(asset) ? ICONS.Overdue : (ICONS[asset.condition] || ICONS.Good)
      const marker = L.marker([asset.lat, asset.lng], { icon })
      marker.bindPopup(() => buildPopup(asset, onEdit, onDelete), { minWidth: 226 })
      layerRef.current.addLayer(marker)
    })
  }, [assets, onEdit, onDelete])

  return (
    <div className="relative h-full w-full">
      <div ref={containerRef} className="h-full w-full cursor-crosshair" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[500] pointer-events-none
        flex items-center gap-1.5 px-5 py-2 rounded-full text-txt2 text-xs font-medium whitespace-nowrap
        border border-border"
        style={{ background: 'rgba(7,8,15,0.9)', backdropFilter: 'blur(10px)' }}>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/>
        </svg>
        Click anywhere on the map to place or update an asset
      </div>
    </div>
  )
}