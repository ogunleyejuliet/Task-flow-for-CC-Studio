import {
  type InputHTMLAttributes,
  type ReactNode,
  forwardRef,
  useRef,
  useId,
  useEffect,
  useCallback,
  type Ref,
} from 'react'
import { cx } from '../../utils/cx'
import styles from './Checkbox.module.css'

export interface CheckboxProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: ReactNode
  error?: string
  size?: 'sm' | 'md'
  indeterminate?: boolean
}

function assignRef<T>(ref: Ref<T> | null | undefined, value: T | null) {
  if (typeof ref === 'function') {
    ref(value)
  } else if (ref && 'current' in ref) {
    ref.current = value
  }
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  function Checkbox(
    {
      label,
      error,
      size = 'md',
      indeterminate = false,
      disabled,
      required,
      className,
      id: idProp,
      'aria-describedby': ariaDescribedBy,
      ...rest
    },
    forwardedRef,
  ) {
    const autoId = useId()
    const id = idProp ?? autoId
    const errorId = `${id}-error`
    const internalRef = useRef<HTMLInputElement>(null)

    const setRefs = useCallback(
      (el: HTMLInputElement | null) => {
        internalRef.current = el
        assignRef(forwardedRef, el)
      },
      [forwardedRef],
    )

    useEffect(() => {
      const el = internalRef.current
      if (el) {
        el.indeterminate = indeterminate
      }
    }, [indeterminate])

    return (
      <div className={cx(styles.field, className)}>
        <label
          className={cx(
            styles.label,
            disabled && styles.disabled,
            error && styles.hasError,
          )}
          htmlFor={id}
        >
          <input
            ref={setRefs}
            id={id}
            type="checkbox"
            className={styles.nativeInput}
            disabled={disabled}
            required={required}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? errorId : ariaDescribedBy}
            {...rest}
          />
          <span className={styles.box} data-size={size} aria-hidden="true" />
          {label != null && <span className={styles.text}>{label}</span>}
        </label>
        {error && (
          <p className={styles.errorMessage} id={errorId} role="alert">
            {error}
          </p>
        )}
      </div>
    )
  },
)