import { useState } from 'react'
import { Plus }        from 'lucide-react'
import RecordsTable    from '../components/RecordsTable'
import AssetModal      from '../components/AssetModal'

export default function RecordsPage({ assets, onSave, onDelete }) {
  const [modal, setModal] = useState(null)

  const handleEdit = asset => setModal({ asset })
  const openManual = () => setModal({ asset: null, manual: true })
  const handleSave = async data => { await onSave(data); setModal(null) }

  return (
    <div className="h-full flex flex-col overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-[18px] pb-[14px] flex-shrink-0">
        <div>
          <h1 className="text-[20px] font-extrabold tracking-tight">Asset Records</h1>
          <p className="text-muted text-[13px] font-medium mt-0.5">{assets.length} total assets in the system</p>
        </div>
        <button onClick={openManual}
          className="flex items-center gap-1.5 bg-accent hover:bg-accent2 text-white
            rounded-[10px] px-[17px] py-[9px] text-[13px] font-bold transition-all"
          style={{ boxShadow: '0 0 16px rgba(68,117,227,0.25)' }}>
          <Plus size={13} strokeWidth={2.8} />
          Add Asset
        </button>
      </div>

      <RecordsTable assets={assets} onEdit={handleEdit} onDelete={onDelete} />

      {modal && (
        <AssetModal
          position={modal.asset ? { lat: modal.asset.lat, lng: modal.asset.lng } : null}
          existingAsset={modal.asset || null}
          manualMode={!!modal.manual}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}