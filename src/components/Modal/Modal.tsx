import { type ReactNode, type MouseEvent, useRef, useEffect, useCallback, useId } from 'react'
import { Icon } from '../Icon'
import { cx } from '../../utils/cx'
import styles from './Modal.module.css'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: ReactNode
  footer?: ReactNode
  size?: ModalSize
}

const sizeClass: Record<ModalSize, string> = {
  sm: styles.sm,
  md: styles.md,
  lg: styles.lg,
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = 'md',
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    const el = dialogRef.current
    if (!el) return
    if (open && !el.open) {
      el.showModal()
    } else if (!open && el.open) {
      el.close()
    }
  }, [open])

  const handleBackdropClick = useCallback(
    (e: MouseEvent<HTMLDialogElement>) => {
      if (e.target === dialogRef.current) {
        onClose()
      }
    },
    [onClose],
  )

  return (
    <dialog
      ref={dialogRef}
      className={cx(styles.dialog, sizeClass[size])}
      onCancel={onClose}
      onClick={handleBackdropClick}
      aria-labelledby={`${titleId}-title`}
      aria-describedby={description ? `${descId}-desc` : undefined}
    >
      <header className={styles.header}>
        <div className={styles.headerText}>
          <h2 className={styles.title} id={`${titleId}-title`}>
            {title}
          </h2>
          {description && (
            <p className={styles.description} id={`${descId}-desc`}>
              {description}
            </p>
          )}
        </div>
        <button
          type="button"
          className={styles.closeButton}
          onClick={onClose}
          aria-label="Close"
        >
          <Icon name="close" size={20} />
        </button>
      </header>
      <div className={styles.content}>{children}</div>
      {footer && <footer className={styles.footer}>{footer}</footer>}
    </dialog>
  )
}