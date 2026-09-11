import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon } from '../Icon'
import { Input } from '../Input'
import { Avatar } from '../Avatar'
import { Tooltip } from '../Tooltip'
import styles from './Topbar.module.css'

export interface TopbarProps {
  /** Handler for the mobile navigation toggle. */
  onMenuClick?: () => void
  /** Brand block shown on the left next to the menu toggle. */
  brand?: ReactNode
  /** Custom search element; set `null` to hide. */
  search?: ReactNode | null
  /** Right-side action cluster. */
  actions?: ReactNode
  /** Current user shown in a compact profile cluster. */
  user?: { name: string; avatarUrl?: string | null } | null
  className?: string
}

export function Topbar({
  onMenuClick,
  brand,
  search,
  actions,
  user = null,
  className,
}: TopbarProps) {
  return (
    <header className={cx(styles.topbar, className)}>
      <div className={styles.left}>
        {onMenuClick && (
          <button
            type="button"
            className={styles.menuButton}
            onClick={onMenuClick}
            aria-label="Open navigation"
          >
            <Icon name="menu" size={20} />
          </button>
        )}
        {brand && <div className={styles.brand}>{brand}</div>}
      </div>
      <div className={styles.center}>
        {search === undefined ? (
          <Input
            aria-label="Search"
            leadingIcon="search"
            placeholder="Search tasks..."
            className={styles.search}
          />
        ) : (
          search
        )}
      </div>
      <div className={styles.right}>
        {actions ?? (
          <>
            <Tooltip content="Notifications" position="bottom" delay={0}>
              <button
                type="button"
                className={styles.iconButton}
                aria-label="Notifications"
              >
                <Icon name="bell" size={20} />
              </button>
            </Tooltip>
            {user && (
              <Tooltip content={user.name} position="bottom" delay={0}>
                <button
                  type="button"
                  className={styles.profileButton}
                  aria-label={`Account: ${user.name}`}
                >
                  <Avatar name={user.name} src={user.avatarUrl} size="sm" />
                </button>
              </Tooltip>
            )}
          </>
        )}
      </div>
    </header>
  )
}