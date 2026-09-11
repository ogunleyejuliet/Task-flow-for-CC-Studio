import { type SelectHTMLAttributes, forwardRef, useId } from 'react'
import { cx } from '../../utils/cx'
import { Icon } from '../Icon'
import styles from './Select.module.css'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  helperText?: string
  error?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    helperText,
    error,
    disabled,
    required,
    children,
    className,
    id: idProp,
    'aria-describedby': ariaDescribedBy,
    ...rest
  },
  ref,
) {
  const autoId = useId()
  const id = idProp ?? autoId
  const helperId = `${id}-helper`
  const errorId = `${id}-error`
  const descriptionIds = [helperText ? helperId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ')

  return (
    <div className={cx(styles.field, disabled && styles.disabled, className)}>
      {label && (
        <label className={styles.label} htmlFor={id}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}
      <div className={cx(styles.selectWrapper, error && styles.hasError)}>
        <select
          ref={ref}
          id={id}
          className={styles.select}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [descriptionIds, ariaDescribedBy].filter(Boolean).join(' ') || undefined
          }
          {...rest}
        >
          {children}
        </select>
        <Icon
          name="chevron-down"
          size={16}
          className={styles.icon}
          aria-hidden="true"
        />
      </div>
      {helperText && !error && (
        <p className={styles.helper} id={helperId}>
          {helperText}
        </p>
      )}
      {error && (
        <p className={styles.errorMessage} id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  )
})