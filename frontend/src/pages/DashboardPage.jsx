import Analytics from '../components/Analytics'

export default function DashboardPage({ assets }) {
  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="flex items-center justify-between px-6 pt-[18px] pb-0 shrink-0">
        <div>
          <h1 className="text-[20px] font-extrabold tracking-tight">Analytics Dashboard</h1>
          <p className="text-muted text-[13px] font-medium mt-0.5">Real-time civic infrastructure overview</p>
        </div>
      </div>
      <Analytics assets={assets} />
    </div>
  )
}