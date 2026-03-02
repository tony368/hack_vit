import { NavLink } from 'react-router-dom'
import { MapPin, TableProperties, BarChart3 } from 'lucide-react'
import { isOverdue } from '../utils/overdueCheck'

const NAV = [
  { to: '/',          label: 'Map',       Icon: MapPin },
  { to: '/records',   label: 'Records',   Icon: TableProperties },
  { to: '/dashboard', label: 'Dashboard', Icon: BarChart3 },
]

export default function Navbar({ assets = [] }) {
  const overdueCount = assets.filter(isOverdue).length

  return (
    <header className="h-[58px] flex items-center px-6 gap-3 bg-surface border-b border-border flex-shrink-0 z-50">

      {/* Brand */}
      <div className="flex items-center gap-3 mr-auto">
        <div className="w-[34px] h-[34px] rounded-[9px] flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#4475e3,#06c4d4)', boxShadow: '0 0 18px rgba(68,117,227,0.35)' }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
        </div>
        <div>
          <div className="text-txt font-extrabold text-[15px] tracking-tight leading-none">Infra Init.</div>
          <div className="text-muted text-[10px] mt-0.5 tracking-wide font-medium">Civic Infrastructure</div>
        </div>
      </div>

      {/* Tabs */}
      <nav className="flex gap-1">
        {NAV.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-1.5 px-4 py-[6px] rounded-[8px] text-[13px] font-semibold
               tracking-tight no-underline transition-all duration-150
               ${isActive ? 'bg-elevated text-txt' : 'text-muted hover:text-txt2 hover:bg-white/[0.03]'}`
            }
          >
            <Icon size={13} strokeWidth={2.2} />
            {label}
            {label === 'Dashboard' && overdueCount > 0 && (
              <span className="absolute top-0.5 right-0.5 min-w-[16px] h-4 rounded-lg bg-crit text-white
                text-[9px] font-black flex items-center justify-center px-1">
                {overdueCount}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Stats pill */}
      <div className="flex items-center gap-2.5 px-4 py-[5px] bg-elevated border border-border rounded-full text-[11.5px] font-medium">
        <span className="text-muted">Assets: <span className="text-txt font-bold">{assets.length}</span></span>
        <span className="text-muted">Overdue: <span className="text-crit font-bold">{overdueCount}</span></span>
      </div>

    </header>
  )
}