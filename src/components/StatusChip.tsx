import { statusMeta, type TournamentStatus } from '../data/tournaments'

export default function StatusChip({ status }: { status: TournamentStatus }) {
  const meta = statusMeta[status]
  const cls =
    meta.tone === 'purple'
      ? 'chip-purple'
      : meta.tone === 'red'
        ? 'chip-red'
        : meta.tone === 'white'
          ? 'chip-white'
          : 'chip'

  return (
    <span className={cls}>
      {status === 'live' && <span className="h-1.5 w-1.5 animate-pulseDot rounded-full bg-crimson-500" />}
      {meta.label}
    </span>
  )
}
