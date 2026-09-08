import { ReactNode, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import type { TeamId } from '../engine/types'

export const money = (n: number, opts: { sign?: boolean } = {}) => {
  const abs = Math.abs(Math.round(n))
  const sign = opts.sign ? (n > 0 ? '+' : n < 0 ? '−' : '') : (n < 0 ? '−' : '')
  return `${sign}₹${abs.toLocaleString('en-IN')}`
}

export const fmtTime = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000))
  const h = Math.floor(total / 3600)
  const m = Math.floor((total % 3600) / 60)
  const s = total % 60
  const pad = (n: number) => n.toString().padStart(2, '0')
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`
}

export function TeamBadge({ team, name, className = '', large = false }: { team: TeamId; name?: string; className?: string; large?: boolean }) {
  const isA = team === 'A'
  const base = `inline-flex items-center gap-1.5 rounded-md font-bold uppercase tracking-wide border
    ${isA ? 'bg-teamA-50 text-teamA-700 border-teamA-300' : 'bg-teamB-50 text-teamB-700 border-teamB-300'}`
  const size = large ? 'px-2.5 py-1 text-xs' : 'px-2 py-0.5 text-[11px]'
  return (
    <span className={`${base} ${size} ${className}`}>
      <span className={`rounded-full ${large ? 'w-2 h-2' : 'w-1.5 h-1.5'} ${isA ? 'bg-teamA-500' : 'bg-teamB-500'}`} />
      {name ?? `Team ${team}`}
    </span>
  )
}

export function Modal({ open, onClose, title, children, wide, footer }:
  { open: boolean; onClose: () => void; title: string; children: ReactNode; wide?: boolean; footer?: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-40 grid place-items-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto" onClick={onClose}>
      <div ref={ref} onClick={e => e.stopPropagation()}
        className={`card w-full ${wide ? 'max-w-4xl' : 'max-w-lg'} p-5 my-auto animate-flyup`}
        role="dialog" aria-modal="true" aria-label={title}>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">{title}</h2>
          <button className="text-ink-100 hover:text-ink-400 text-xl leading-none" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
        {footer && <div className="pt-4 mt-4 border-t border-canvas-400 flex justify-end gap-2">{footer}</div>}
      </div>
    </div>,
    document.body
  )
}

export function Section({ title, right, children, className = '' }: { title?: string; right?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`card p-4 ${className}`}>
      {(title || right) && (
        <header className="flex items-center justify-between mb-3">
          {title && <h3 className="text-xs font-bold uppercase tracking-widest text-ink-100">{title}</h3>}
          {right}
        </header>
      )}
      {children}
    </section>
  )
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="text-center py-6 text-ink-100">
      <div className="text-sm font-semibold text-ink-300 mb-1">{title}</div>
      {children && <div className="text-xs">{children}</div>}
    </div>
  )
}
