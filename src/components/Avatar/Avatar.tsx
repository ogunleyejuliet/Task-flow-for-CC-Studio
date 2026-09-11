import { type ImgHTMLAttributes, useState } from 'react'
import { cx } from '../../utils/cx'
import styles from './Avatar.module.css'

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg'
export type AvatarStatus = 'online' | 'away' | 'busy' | 'offline'

export interface AvatarProps
  extends Omit<ImgHTMLAttributes<HTMLImageElement>, 'src' | 'alt'> {
  /** Person's name. Used for alt text and the initials fallback. */
  name: string
  /** Profile image URL. When omitted or failing, initials are shown. */
  src?: string | null
  size?: AvatarSize
  /** Presence indicator. */
  status?: AvatarStatus | null
}

function initialsFor(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return '?'
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase()
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
}

export function Avatar({
  name,
  src,
  size = 'md',
  status = null,
  className,
  ...rest
}: AvatarProps) {
  const [failed, setFailed] = useState(false)
  const showImage = Boolean(src) && !failed

  return (
    <span
      className={cx(styles.avatar, styles[size], className)}
      title={name}
      role="img"
      aria-label={name}
    >
      {showImage ? (
        <img
          src={src ?? undefined}
          alt=""
          className={styles.image}
          onError={() => setFailed(true)}
          loading="lazy"
          draggable={false}
          {...rest}
        />
      ) : (
        <span className={styles.initials} aria-hidden="true">
          {initialsFor(name)}
        </span>
      )}
      {status && <span className={cx(styles.status, styles[status])} />}
    </span>
  )
}