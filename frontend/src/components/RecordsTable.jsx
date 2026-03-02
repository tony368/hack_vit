import { useState, useMemo } from 'react'
import { Search, Pencil, Trash2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { isOverdue } from '../utils/overdueCheck'

const BADGE = {
  Good:      'bg-good/10 text-emerald-400 border border-good/25',
  Defective: 'bg-warn/10 text-yellow-400  border border-warn/25',
  Critical:  'bg-crit/10 text-red-400     border border-crit/25',
}

const COLS = [
  { key: 'type',                  label: 'Type'        },
  { key: 'condition',             label: 'Condition'   },
  { key: 'zone',                  label: 'Zone'        },
  { key: 'last_maintenance_date', label: 'Last Maint.' },
]

export default function RecordsTable({ assets, onEdit, onDelete }) {
  const [search,  setSearch]  = useState('')
  const [sortKey, setSortKey] = useState('type')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return assets
      .filter(a => !q || [a.type, a.condition, a.zone, a.status].some(v => (v||'').toLowerCase().includes(q)))
      .sort((a, b) => {
        const va = (a[sortKey]||'').toString(), vb = (b[sortKey]||'').toString()
        return sortDir === 'asc' ? va.localeCompare(vb) : vb.localeCompare(va)
      })
  }, [assets, search, sortKey, sortDir])

  const toggleSort = key => {
    if (sortKey === key) setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    else { setSortKey(key); setSortDir('asc') }
  }

  const SortIcon = ({ col }) => {
    if (sortKey !== col.key) return <ArrowUpDown size={11} className="opacity-30" />
    return sortDir === 'asc' ? <ArrowUp size={11} className="text-accent" /> : <ArrowDown size={11} className="text-accent" />
  }

  return (
    <div className="flex flex-col flex-1 overflow-hidden">

      {/* Search bar */}
      <div className="flex items-center gap-2.5 px-5 py-3 border-b border-border bg-surface flex-shrink-0">
        <Search size={15} className="text-muted flex-shrink-0" />
        <input
          type="text" value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search type, condition, zone, status…"
          className="flex-1 bg-transparent border-none outline-none text-[13.5px] text-txt font-medium placeholder:text-muted"
        />
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="w-full border-collapse text-[13px]">
          <thead className="sticky top-0 bg-surface border-b border-border z-10">
            <tr>
              {COLS.map(col => (
                <th key={col.key} onClick={() => toggleSort(col.key)}
                  className="px-4 py-2.5 text-left text-[10.5px] font-bold text-muted uppercase tracking-[0.08em]
                    cursor-pointer select-none whitespace-nowrap hover:text-txt2 transition-colors">
                  <span className="inline-flex items-center gap-1.5">
                    {col.label} <SortIcon col={col} />
                  </span>
                </th>
              ))}
              <th className="px-4 py-2.5 text-left text-[10.5px] font-bold text-muted uppercase tracking-[0.08em]">Status</th>
              <th className="px-4 py-2.5 text-right text-[10.5px] font-bold text-muted uppercase tracking-[0.08em]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan={6} className="py-14 text-center text-muted font-medium">No assets found</td>
              </tr>
            )}
            {filtered.map(asset => {
              const overdue = isOverdue(asset)
              return (
                <tr key={asset.id}
                  className={`border-b border-border/50 transition-colors hover:bg-hover ${overdue ? 'bg-red-950/[0.06]' : ''}`}>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2 text-txt font-semibold">
                      {overdue && <span className="w-1.5 h-1.5 rounded-full bg-crit flex-shrink-0 animate-pulse" />}
                      {asset.type}
                    </div>
                  </td>
                  <td className="px-4 py-2.5">
                    <span className={`inline-block text-[10.5px] font-bold px-2.5 py-0.5 rounded-full ${BADGE[asset.condition] || ''}`}>
                      {asset.condition}
                    </span>
                  </td>
                  <td className="px-4 py-2.5 text-txt2 font-medium">{asset.zone  || '—'}</td>
                  <td className="px-4 py-2.5 text-txt2 font-medium">{asset.last_maintenance_date || '—'}</td>
                  <td className="px-4 py-2.5 text-txt2 font-medium">{asset.status || '—'}</td>
                  <td className="px-4 py-2.5 text-right">
                    <button onClick={() => onEdit(asset)} title="Edit"
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-accent
                        hover:bg-accent/15 hover:text-blue-400 transition-all">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => onDelete(asset.id)} title="Delete"
                      className="inline-flex items-center justify-center p-1.5 rounded-lg text-muted ml-1
                        hover:bg-crit/10 hover:text-crit transition-all">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-5 py-2 border-t border-border bg-surface text-muted text-[11.5px] font-medium flex-shrink-0">
        {filtered.length} of {assets.length} records
        {search && ` · searching "${search}"`}
      </div>
    </div>
  )
}