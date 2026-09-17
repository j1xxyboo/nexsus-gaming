export default function Logo({ className = 'h-10 w-10' }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={className} role="img" aria-label="Nexsus">
      <defs>
        <linearGradient id="nx" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="55%" stopColor="#7c3aed" />
          <stop offset="100%" stopColor="#dc2626" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="44" height="44" rx="14" fill="url(#nx)" />
      <path
        d="M15 34V14l8.5 11.5L32 14v20"
        fill="none"
        stroke="#ffffff"
        strokeWidth="3.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
