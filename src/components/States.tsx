import type { ReactNode } from 'react'

export function Loading({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="card flex items-center gap-3 p-8">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-brand-500 border-t-transparent" />
      <span className="text-sm text-slate-400">{label}</span>
    </div>
  )
}

export function ErrorState({ message }: { message: string }) {
  return (
    <div className="card border-crimson-600/40 p-8">
      <p className="font-display text-xl tracking-wide text-white">Could not load that</p>
      <p className="muted mt-2">{message}</p>
    </div>
  )
}

export function Empty({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card p-10 text-center">
      <p className="font-display text-2xl tracking-wide text-white">{title}</p>
      {children && <p className="muted mx-auto mt-2 max-w-md">{children}</p>}
    </div>
  )
}
