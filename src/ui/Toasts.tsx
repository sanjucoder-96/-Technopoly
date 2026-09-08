import { useEffect } from 'react'
import { useGame } from '../store/gameStore'

const KIND_STYLES: Record<string, string> = {
  info:    'border-teamA-300 bg-white text-ink-500',
  success: 'border-emerald-300 bg-emerald-50 text-emerald-900',
  warn:    'border-amber-300 bg-amber-50 text-amber-900',
  error:   'border-rose-300 bg-rose-50 text-rose-900'
}

const ICONS: Record<string, string> = {
  info: 'ℹ',
  success: '✓',
  warn: '!',
  error: '✕'
}

export function ToastLayer() {
  const toasts = useGame(s => s.toasts)
  const dismiss = useGame(s => s.dismissToast)

  useEffect(() => {
    if (toasts.length === 0) return
    const timers = toasts.map(t => setTimeout(() => dismiss(t.id), 3800))
    return () => timers.forEach(clearTimeout)
  }, [toasts, dismiss])

  return (
    <div className="fixed z-50 bottom-4 right-4 flex flex-col gap-2 max-w-sm">
      {toasts.slice(-5).map(t => (
        <div
          key={t.id}
          className={`animate-flyup rounded-xl border-2 px-4 py-3 shadow-pop ${KIND_STYLES[t.kind]}`}
          role="status"
        >
          <div className="flex items-center gap-2 font-semibold text-sm">
            <span className="w-5 h-5 rounded-full bg-white/60 grid place-items-center text-xs border border-current">{ICONS[t.kind]}</span>
            {t.title}
          </div>
          {t.message && <div className="text-xs opacity-80 mt-1">{t.message}</div>}
        </div>
      ))}
    </div>
  )
}
