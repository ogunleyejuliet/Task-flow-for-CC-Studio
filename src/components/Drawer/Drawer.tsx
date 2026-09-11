import {
  type ReactNode,
  type KeyboardEvent,
  useRef,
  useEffect,
  useCallback,
} from 'react'
import { createPortal } from 'react-dom'
import { Icon } from '../Icon'
import { cx } from '../../utils/cx'
import styles from './Drawer.module.css'

export type DrawerSide = 'left' | 'right'

export interface DrawerProps {
  open: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  footer?: ReactNode
  side?: DrawerSide
  /** Width in px for left/right drawers. Defaults to 400. */
  size?: number
}

function getFocusable(container: HTMLElement): HTMLElement[] {
  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}

export function Drawer({
  open,
  onClose,
  title,
  children,
  footer,
  side = 'right',
  size = 400,
}: DrawerProps) {
  const drawerRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement | null
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        const focusable = drawerRef.current && getFocusable(drawerRef.current)
        focusable?.[0]?.focus()
      })
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key !== 'Tab') return
      const container = drawerRef.current
      if (!container) return
      const focusable = getFocusable(container)
      if (focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    },
    [onClose],
  )

  if (!open) return null

  return createPortal(
    <div className={styles.overlay} onPointerDown={onClose}>
      <div
        ref={drawerRef}
        role="dialog"
        aria-label={title ?? 'Drawer'}
        aria-modal="true"
        className={cx(styles.drawer, styles[side])}
        style={{ width: size, [side]: 0 }}
        onPointerDown={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {title && (
          <header className={styles.header}>
            <h2 className={styles.title}>{title}</h2>
            <button
              type="button"
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Close"
            >
              <Icon name="close" size={20} />
            </button>
          </header>
        )}
        {!title && (
          <button
            type="button"
            className={cx(styles.closeButton, styles.floating)}
            onClick={onClose}
            aria-label="Close"
          >
            <Icon name="close" size={20} />
          </button>
        )}
        <div className={styles.content}>{children}</div>
        {footer && <footer className={styles.footer}>{footer}</footer>}
      </div>
    </div>,
    document.body,
  )
}