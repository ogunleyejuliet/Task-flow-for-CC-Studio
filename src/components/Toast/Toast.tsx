import {
  type ReactNode,
  useState,
  useCallback,
  useRef,
  useMemo,
  useEffect,
} from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from '../Icon'
import {
  ToastContext,
  type ToastAPI,
  type ToastInput,
  type ToastVariant,
} from './useToast'
import styles from './Toast.module.css'

export type { ToastInput, ToastVariant }
export type { ToastAPI }

export interface ToastItem extends ToastInput {
  id: string
  variant: ToastVariant
  duration: number
  leaving: boolean
}

const DEFAULT_DURATION = 5000

const iconByVariant: Record<ToastVariant, IconName> = {
  success: 'check-circle',
  error: 'alert-circle',
  warning: 'alert-triangle',
  info: 'info',
}

let nextId = 0
function createId(): string {
  nextId = (nextId + 1) % Number.MAX_SAFE_INTEGER
  return `toast-${Date.now()}-${nextId}`
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<Record<string, number>>({})

  const clearTimer = useCallback((id: string) => {
    const t = timers.current[id]
    if (t) window.clearTimeout(t)
    delete timers.current[id]
  }, [])

  const scheduleDismiss = useCallback(
    (id: string, duration: number) => {
      clearTimer(id)
      if (duration <= 0) return
      timers.current[id] = window.setTimeout(
        () =>
          setToasts((prev) =>
            prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
          ),
        duration,
      )
    },
    [clearTimer],
  )

  useEffect(() => {
    return () => {
      Object.values(timers.current).forEach((t) => window.clearTimeout(t))
      timers.current = {}
    }
  }, [])

  const dismiss = useCallback(
    (id: string) => {
      clearTimer(id)
      setToasts((prev) =>
        prev.map((t) => (t.id === id ? { ...t, leaving: true } : t)),
      )
      window.setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 200)
    },
    [clearTimer],
  )

  const push = useCallback(
    (input: ToastInput): string => {
      const item: ToastItem = {
        id: createId(),
        title: input.title,
        description: input.description,
        variant: input.variant ?? 'info',
        duration: input.duration ?? DEFAULT_DURATION,
        leaving: false,
      }
      setToasts((prev) => [...prev, item])
      scheduleDismiss(item.id, item.duration)
      return item.id
    },
    [scheduleDismiss],
  )

  const api = useMemo<ToastAPI>(
    () => ({
      push,
      dismiss,
      success: (title, description, options) =>
        push({ title, description, variant: 'success', ...options }),
      error: (title, description, options) =>
        push({ title, description, variant: 'error', ...options }),
      warning: (title, description, options) =>
        push({ title, description, variant: 'warning', ...options }),
      info: (title, description, options) =>
        push({ title, description, variant: 'info', ...options }),
    }),
    [push, dismiss],
  )

  return (
    <ToastContext.Provider value={api}>
      {children}
      <div
        className={styles.container}
        aria-live="polite"
        aria-atomic="false"
        role="status"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={cx(
              styles.toast,
              styles[toast.variant],
              toast.leaving && styles.leaving,
            )}
            onMouseEnter={() => clearTimer(toast.id)}
            onMouseLeave={() => scheduleDismiss(toast.id, toast.duration)}
          >
            <span className={styles.icon}>
              <Icon
                name={iconByVariant[toast.variant]}
                size={20}
                aria-hidden="true"
              />
            </span>
            <div className={styles.body}>
              <p className={styles.title}>{toast.title}</p>
              {toast.description && (
                <p className={styles.description}>{toast.description}</p>
              )}
            </div>
            <button
              type="button"
              className={styles.closeButton}
              onClick={() => dismiss(toast.id)}
              aria-label="Dismiss notification"
            >
              <Icon name="close" size={16} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}