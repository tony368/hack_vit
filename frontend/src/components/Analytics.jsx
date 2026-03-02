import {
  PieChart, Pie, Cell,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line,
} from 'recharts'
import { AlertTriangle } from 'lucide-react'
import { isOverdue }     from '../utils/overdueCheck'
import {
  aggregateByCondition, aggregateByType,
  aggregateMaintenanceByMonth, getSummaryStats,
} from '../utils/analyticsHelpers'

const COND_COLORS = { Good: '#0fba7d', Defective: '#f0a429', Critical: '#f04545' }
const TYPE_COLORS = ['#4475e3', '#8b5cf6', '#06c4d4']

const ChartTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-surface border border-border rounded-[9px] px-3 py-2 text-xs text-txt shadow-xl"
      style={{ fontFamily: "'Satoshi','TT Norms Pro',sans-serif" }}>
      {label && <div className="text-txt2 font-semibold mb-1">{label}</div>}
      {payload.map(p => (
        <div key={p.name} className="font-bold" style={{ color: p.color || p.fill }}>{p.value}</div>
      ))}
    </div>
  )
}

const STAT_CARDS = [
  { label: 'Total Assets',    key: 'total',    color: '#60a5fa' },
  { label: 'Overdue',         key: 'overdue',  color: '#f87171', sub: '>6 months' },
  { label: 'Critical',        key: 'critical', color: '#fb923c' },
  { label: 'Good Condition',  key: 'good',     color: '#4ade80' },
]

const Empty = () => (
  <div className="h-36 flex items-center justify-center text-muted text-[13px] font-medium">No data yet</div>
)

export default function Analytics({ assets }) {
  const stats     = getSummaryStats(assets)
  const condData  = aggregateByCondition(assets)
  const typeData  = aggregateByType(assets)
  const maintData = aggregateMaintenanceByMonth(assets)
  const overdue   = assets.filter(isOverdue)

  return (
    <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {STAT_CARDS.map(({ label, key, color, sub }) => (
          <div key={key} className="bg-card border border-border rounded-[14px] px-[18px] py-4 relative overflow-hidden">
            <div className="text-[34px] font-black tracking-[-0.05em] leading-none" style={{ color }}>
              {stats[key]}
            </div>
            <div className="text-txt text-xs font-semibold mt-1.5">{label}</div>
            {sub && <div className="text-muted text-[10.5px] font-medium mt-0.5">{sub}</div>}
          </div>
        ))}
      </div>

      {/* Pie + Bar */}
      <div className="grid grid-cols-2 gap-3.5">
        <div className="bg-card border border-border rounded-[14px] p-[18px]">
          <div className="text-txt text-[13px] font-bold tracking-tight mb-3.5">Condition Distribution</div>
          {condData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={condData} cx="50%" cy="50%" innerRadius={48} outerRadius={78}
                  paddingAngle={4} dataKey="value"
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  labelLine={{ stroke: '#3d5070', strokeWidth: 1 }}>
                  {condData.map(e => <Cell key={e.name} fill={COND_COLORS[e.name] || '#64748b'} />)}
                </Pie>
                <Tooltip content={<ChartTip />} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="bg-card border border-border rounded-[14px] p-[18px]">
          <div className="text-txt text-[13px] font-bold tracking-tight mb-3.5">Asset Count by Type</div>
          {typeData.length === 0 ? <Empty /> : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={typeData} barSize={36}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f2a40" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 12, fill: '#6b85a8', fontFamily: 'Satoshi,sans-serif' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#6b85a8', fontFamily: 'Satoshi,sans-serif' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {typeData.map((e, i) => <Cell key={e.name} fill={TYPE_COLORS[i % TYPE_COLORS.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Line chart */}
      <div className="bg-card border border-border rounded-[14px] p-[18px]">
        <div className="text-txt text-[13px] font-bold tracking-tight mb-3.5">Maintenance Activity — Last 12 Months</div>
        {maintData.length === 0 ? <Empty /> : (
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={maintData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1f2a40" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#6b85a8', fontFamily: 'Satoshi,sans-serif' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#6b85a8', fontFamily: 'Satoshi,sans-serif' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <Tooltip content={<ChartTip />} />
              <Line type="monotone" dataKey="count" stroke="#4475e3" strokeWidth={2.5}
                dot={{ fill: '#4475e3', r: 4, strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#6b9aff' }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Overdue list */}
      {overdue.length > 0 && (
        <div className="rounded-[14px] p-[18px] border border-crit/20" style={{ background: 'rgba(127,29,29,0.1)' }}>
          <div className="flex items-center gap-2 text-red-400 text-[13px] font-bold mb-3">
            <AlertTriangle size={15} />
            Overdue Assets ({overdue.length})
          </div>
          <div className="flex flex-col gap-1.5">
            {overdue.map(a => (
              <div key={a.id} className="flex items-center justify-between rounded-lg px-3 py-2 text-xs font-medium"
                style={{ background: 'rgba(127,29,29,0.14)' }}>
                <span className="text-red-300 font-bold">{a.type}</span>
                <span className="text-red-300/50">{a.zone || 'No zone'}</span>
                <span className="text-red-300/50">
                  {a.last_maintenance_date ? `Last: ${a.last_maintenance_date}` : 'Never maintained'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}