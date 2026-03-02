import { useState, useEffect } from 'react'
import { X, Info } from 'lucide-react'

const EMPTY = { type: 'Lamp', condition: 'Good', status: '', zone: '', installation_date: '', last_maintenance_date: '' }

const inputCls = [
  'w-full bg-card border border-border rounded-[10px] px-3 py-[9px]',
  'text-[13px] text-txt font-medium outline-none',
  'transition-all duration-150 appearance-none',
  'focus:border-accent focus:ring-2 focus:ring-accent/20',
  'placeholder:text-muted',
].join(' ')

const labelCls = 'block text-txt2 text-[10.5px] font-bold uppercase tracking-[0.09em] mb-1.5'

export default function AssetModal({ position, existingAsset, manualMode = false, onSave, onClose }) {
  const [form,   setForm]   = useState(EMPTY)
  const [lat,    setLat]    = useState('')
  const [lng,    setLng]    = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (existingAsset) {
      setForm({
        type:                  existingAsset.type                  || 'Lamp',
        condition:             existingAsset.condition             || 'Good',
        status:                existingAsset.status                || '',
        zone:                  existingAsset.zone                  || '',
        installation_date:     existingAsset.installation_date     || '',
        last_maintenance_date: existingAsset.last_maintenance_date || '',
      })
      setLat(existingAsset.lat ?? '')
      setLng(existingAsset.lng ?? '')
    } else {
      setForm(EMPTY)
      setLat(position?.lat ?? '')
      setLng(position?.lng ?? '')
    }
  }, [existingAsset, position])

  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }))

  const handleSubmit = async e => {
    e.preventDefault()
    const fLat = parseFloat(lat), fLng = parseFloat(lng)
    if (isNaN(fLat) || isNaN(fLng))    { alert('Please enter valid coordinates.'); return }
    if (fLat < -90  || fLat > 90)      { alert('Latitude must be between -90 and 90.'); return }
    if (fLng < -180 || fLng > 180)     { alert('Longitude must be between -180 and 180.'); return }
    setSaving(true)
    await onSave({ ...form, id: existingAsset?.id, lat: fLat, lng: fLng })
    setSaving(false)
    onClose()
  }

  const isEdit = !!existingAsset
  const title  = isEdit ? 'Update Asset' : 'Add Asset'
  const sub    = isEdit
    ? `Editing · ${(+lat).toFixed(5)}, ${(+lng).toFixed(5)}`
    : manualMode ? 'Enter coordinates and asset details'
    : `Placing at ${(+lat).toFixed(5)}, ${(+lng).toFixed(5)}`

  return (
    <div
      className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-elevated border border-border2 rounded-[20px] w-full max-w-[460px] overflow-hidden"
        style={{ boxShadow: '0 40px 80px rgba(0,0,0,0.7)' }}>

        {/* Header */}
        <div className="flex items-start justify-between px-6 pt-5 pb-4 border-b border-border">
          <div>
            <div className="text-txt font-extrabold text-base tracking-tight">{title}</div>
            <div className="text-muted text-[11.5px] font-medium mt-1">{sub}</div>
          </div>
          <button onClick={onClose}
            className="text-muted hover:text-txt hover:bg-hover p-1 rounded-lg transition-all ml-3 mt-0.5">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-3.5">

          {/* Manual coords */}
          {manualMode && (
            <>
              <div className="flex items-center gap-2 px-3 py-2.5 rounded-[9px] text-txt2 text-[11.5px] font-medium
                bg-accent/[0.08] border border-accent/20">
                <Info size={14} className="text-accent flex-shrink-0" />
                Enter coordinates manually — or click the map to auto-place
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelCls}>Latitude</label>
                  <input type="number" value={lat} onChange={e => setLat(e.target.value)}
                    className={inputCls} placeholder="e.g. 51.5074" step="any" required />
                </div>
                <div>
                  <label className={labelCls}>Longitude</label>
                  <input type="number" value={lng} onChange={e => setLng(e.target.value)}
                    className={inputCls} placeholder="e.g. -0.1278" step="any" required />
                </div>
              </div>
              <div className="h-px bg-border" />
            </>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Type</label>
              <select value={form.type} onChange={set('type')} className={inputCls}>
                <option>Lamp</option><option>Road</option><option>Water Line</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Condition</label>
              <select value={form.condition} onChange={set('condition')} className={inputCls}>
                <option>Good</option><option>Defective</option><option>Critical</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Status</label>
              <input type="text" value={form.status} onChange={set('status')}
                className={inputCls} placeholder="e.g. Operational" />
            </div>
            <div>
              <label className={labelCls}>Zone</label>
              <input type="text" value={form.zone} onChange={set('zone')}
                className={inputCls} placeholder="e.g. Zone A" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelCls}>Installation Date</label>
              <input type="date" value={form.installation_date} onChange={set('installation_date')} className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>Last Maintenance</label>
              <input type="date" value={form.last_maintenance_date} onChange={set('last_maintenance_date')} className={inputCls} />
            </div>
          </div>

          <div className="flex gap-2.5 mt-2">
            <button type="button" onClick={onClose}
              className="flex-1 bg-border hover:bg-border2 text-txt2 rounded-[10px] py-3 text-[13px] font-bold transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={saving}
              className="flex-1 bg-accent hover:bg-accent2 text-white rounded-[10px] py-3 text-[13px] font-bold
                transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ boxShadow: '0 0 16px rgba(68,117,227,0.25)' }}>
              {saving ? 'Saving…' : isEdit ? 'Update Asset' : 'Create Asset'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}