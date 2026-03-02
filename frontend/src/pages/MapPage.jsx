import { useState, useCallback } from 'react'
import MapView    from '../components/MapView'
import AssetModal from '../components/AssetModal'
import { findByLocation } from '../utils/mergeLogic'

export default function MapPage({ assets, onSave, onDelete }) {
  const [modal, setModal] = useState(null)

  const handleMapClick = useCallback(latlng => {
    const existing = findByLocation(assets, latlng.lat, latlng.lng)
    setModal({ position: latlng, existingAsset: existing || null })
  }, [assets])

  const handleEdit = useCallback(asset => {
    setModal({ position: { lat: asset.lat, lng: asset.lng }, existingAsset: asset })
  }, [])

  return (
    <div className="h-full w-full relative">
      <MapView
        assets={assets}
        onMapClick={handleMapClick}
        onEdit={handleEdit}
        onDelete={onDelete}
      />
      {modal && (
        <AssetModal
          position={modal.position}
          existingAsset={modal.existingAsset}
          manualMode={false}
          onSave={onSave}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  )
}