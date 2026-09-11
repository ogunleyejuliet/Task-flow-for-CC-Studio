import {
  type CSSProperties,
  type ReactNode,
  useRef,
  useState,
  useCallback,
  useId,
  useEffect,
} from 'react'
import { createPortal } from 'react-dom'
import { cx } from '../../utils/cx'
import styles from './Tooltip.module.css'

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right'

export interface TooltipProps {
  /** Tooltip content. */
  content: ReactNode
  /** Element(s) that trigger the tooltip on hover/focus. */
  children: ReactNode
  /** Tooltip placement. Defaults to `top`. */
  position?: TooltipPosition
  /** Delay before showing in ms. Defaults to 400. */
  delay?: number
  /** If `true` the tooltip will not show. */
  disabled?: boolean
  /** Override the tooltip CSS class (escape hatch). */
  className?: string
}

const OFFSET = 8

function getTooltipStyle(
  position: TooltipPosition,
  triggerRect: DOMRect,
): CSSProperties {
  const { top, bottom, left, right, width, height } = triggerRect
  const halfWidth = width / 2
  const halfHeight = height / 2
  const base: CSSProperties = { position: 'fixed', zIndex: 900 }

  switch (position) {
    case 'top':
      return {
        ...base,
        bottom: window.innerHeight - top + OFFSET,
        left: left + halfWidth,
        transform: 'translateX(-50%)',
      }
    case 'bottom':
      return {
        ...base,
        top: bottom + OFFSET,
        left: left + halfWidth,
        transform: 'translateX(-50%)',
      }
    case 'left':
      return {
        ...base,
        right: window.innerWidth - left + OFFSET,
        top: top + halfHeight,
        transform: 'translateY(-50%)',
      }
    case 'right':
      return {
        ...base,
        left: right + OFFSET,
        top: top + halfHeight,
        transform: 'translateY(-50%)',
      }
  }
}

export function Tooltip({
  content,
  children,
  position = 'top',
  delay = 400,
  disabled = false,
  className,
}: TooltipProps) {
  const triggerRef = useRef<HTMLSpanElement>(null)
  const [visible, setVisible] = useState(false)
  const [style, setStyle] = useState<CSSProperties>({})
  const timerRef = useRef<number>(0)
  const tooltipId = useId()
  const tooltipRef = useRef<HTMLDivElement>(null)

  const openTooltip = useCallback(() => {
    if (disabled || !triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    setStyle(getTooltipStyle(position, rect))
    setVisible(true)
  }, [disabled, position])

  const closeTooltip = useCallback(() => {
    window.clearTimeout(timerRef.current)
    setVisible(false)
  }, [])

  const onEnter = useCallback(() => {
    timerRef.current = window.setTimeout(openTooltip, delay)
  }, [openTooltip, delay])

  const onLeave = useCallback(() => {
    closeTooltip()
  }, [closeTooltip])

  useEffect(() => {
    return () => {
      window.clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <>
      <span
        ref={triggerRef}
        className={styles.trigger}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        onFocus={openTooltip}
        onBlur={closeTooltip}
        aria-describedby={visible ? tooltipId : undefined}
      >
        {children}
      </span>
      {visible &&
        createPortal(
          <div
            ref={tooltipRef}
            id={tooltipId}
            role="tooltip"
            className={cx(styles.tooltip, className)}
            style={style}
            onPointerEnter={onEnter}
            onPointerLeave={onLeave}
          >
            {content}
          </div>,
          document.body,
        )}
    </>
  )
}
