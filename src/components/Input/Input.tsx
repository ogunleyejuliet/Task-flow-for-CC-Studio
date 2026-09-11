import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from '../Icon'
import { Spinner } from '../Spinner'
import styles from './Input.module.css'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  /** Visual label rendered above the control. */
  label?: string
  /** Supporting text below the control. */
  helperText?: string
  /** Error message. Also marks the control as invalid. */
  error?: string
  /** Icon rendered at the start of the input. */
  leadingIcon?: IconName
  /** Icon rendered at the end of the input. */
  trailingIcon?: IconName
  /** Shows a loading spinner at the end of the input. */
  loading?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    helperText,
    error,
    leadingIcon,
    trailingIcon,
    loading = false,
    disabled,
    required,
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
      <div
        className={cx(
          styles.inputWrapper,
          error && styles.inputError,
          loading && styles.loading,
        )}
      >
        {leadingIcon && (
          <Icon
            name={leadingIcon}
            size={18}
            className={styles.prefixIcon}
            aria-hidden="true"
          />
        )}
        <input
          ref={ref}
          id={id}
          className={cx(styles.input, leadingIcon && styles.hasPrefix, trailingIcon && styles.hasSuffix)}
          disabled={disabled}
          required={required}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            [descriptionIds, ariaDescribedBy].filter(Boolean).join(' ') || undefined
          }
          {...rest}
        />
        {trailingIcon && !loading && (
          <Icon
            name={trailingIcon}
            size={18}
            className={styles.suffixIcon}
            aria-hidden="true"
          />
        )}
        {loading && <Spinner size={16} className={styles.suffixIcon} />}
        {error && !loading && !trailingIcon && (
          <Icon
            name="alert-circle"
            size={18}
            className={cx(styles.suffixIcon, styles.errorIcon)}
            aria-hidden="true"
          />
        )}
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