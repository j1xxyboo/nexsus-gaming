import type { ReactNode } from 'react'

export default function SectionHeading({
  eyebrow,
  title,
  children,
  action,
}: {
  eyebrow?: string
  title: string
  children?: ReactNode
  action?: ReactNode
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        {eyebrow && (
          <p className="mb-1 text-xs font-bold uppercase tracking-widest text-crimson-500">{eyebrow}</p>
        )}
        <h2 className="h2">{title}</h2>
        {children && <p className="muted mt-2 max-w-2xl">{children}</p>}
      </div>
      {action}
    </div>
  )
}
