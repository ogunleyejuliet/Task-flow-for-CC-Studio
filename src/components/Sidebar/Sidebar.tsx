import type { ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon, type IconName } from '../Icon'
import { Avatar } from '../Avatar'
import { Button } from '../Button'
import styles from './Sidebar.module.css'

export interface SidebarItem {
  id: string
  label: string
  icon: IconName
  /** Optional count shown as a small badge on the right. */
  badge?: number
}

export interface SidebarSection {
  /** Section heading. Omit for single standalone items. */
  label?: string
  items: SidebarItem[]
}

export interface SidebarUser {
  name: string
  role?: string
  avatarUrl?: string | null
}

export interface SidebarProps {
  sections: SidebarSection[]
  /** Currently selected item id. */
  activeId?: string
  onNavigate?: (id: string) => void
  /** Brand lockup shown at the top. */
  logo?: ReactNode
  user?: SidebarUser
  /** Callback triggered when Sign Out button in sidebar is clicked. */
  onSignOut?: () => void
  /** Controlled `true` while the mobile overlay is open. */
  open?: boolean
  /** Callback when the overlay should close. */
  onClose?: () => void
  sidebarLabel?: string
  className?: string
}

interface ContentProps {
  sections: SidebarSection[]
  activeId?: string
  onNavigate?: (id: string) => void
  logo?: ReactNode
  user?: SidebarUser
  onSignOut?: () => void
  sidebarLabel?: string
}

function SidebarContent({
  sections,
  activeId,
  onNavigate,
  logo,
  user,
  onSignOut,
  sidebarLabel,
}: ContentProps) {
  return (
    <nav className={styles.content} aria-label={sidebarLabel ?? 'Primary'}>
      {logo && <div className={styles.brand}>{logo}</div>}

      <div className={styles.sections}>
        {sections.map((section, sectionIndex) =>
          section.items.length === 0 ? null : (
            <div key={section.label ?? `${sectionIndex}`} className={styles.section}>
              {section.label && (
                <p className={styles.sectionLabel}>{section.label}</p>
              )}
              <ul className={styles.items}>
                {section.items.map((item) => {
                  const isActive = item.id === activeId
                  return (
                    <li key={item.id}>
                      <a
                        href="#"
                        className={cx(styles.item, isActive && styles.active)}
                        aria-current={isActive ? 'page' : undefined}
                        onClick={(e) => {
                          e.preventDefault()
                          onNavigate?.(item.id)
                        }}
                      >
                        <span className={styles.itemIcon}>
                          <Icon name={item.icon} size={18} aria-hidden="true" />
                        </span>
                        <span className={styles.itemLabel}>{item.label}</span>
                        {item.badge ? (
                          <span className={styles.badge}>{item.badge}</span>
                        ) : null}
                      </a>
                    </li>
                  )
                })}
              </ul>
            </div>
          ),
        )}
      </div>

      {(user || onSignOut) && (
        <div className={styles.footer}>
          {user && (
            <div className={styles.userCard}>
              <Avatar name={user.name} src={user.avatarUrl} size="sm" />
              <div className={styles.userText}>
                <span className={styles.userName}>{user.name}</span>
                {user.role && <span className={styles.userRole}>{user.role}</span>}
              </div>
            </div>
          )}
          {onSignOut && (
            <div className={styles.signOutWrapper}>
              <Button
                variant="secondary"
                size="sm"
                leadingIcon="logout"
                onClick={onSignOut}
                fullWidth
              >
                Sign Out
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  )
}

/**
 * Primary application navigation (DESIGN §13).
 *
 * Persistent on desktop, becomes an accessible overlay drawer below the
 * desktop breakpoint — the same component drives both layouts.
 */
export function Sidebar({
  sections,
  activeId,
  onNavigate,
  logo,
  user,
  onSignOut,
  open = false,
  onClose,
  sidebarLabel,
  className,
}: SidebarProps) {
  return (
    <>
      <aside className={cx(styles.desktop, className)}>
        <SidebarContent
          sections={sections}
          activeId={activeId}
          onNavigate={onNavigate}
          logo={logo}
          user={user}
          onSignOut={onSignOut}
          sidebarLabel={sidebarLabel}
        />
      </aside>

      <div className={cx(styles.mobile, open && styles.mobileOpen)}>
        <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
        <aside
          className={styles.overlay}
          role="dialog"
          aria-modal="true"
          aria-label={sidebarLabel ?? 'Primary navigation'}
        >
          <SidebarContent
            sections={sections}
            activeId={activeId}
            onNavigate={(id) => {
              onNavigate?.(id)
              onClose?.()
            }}
            logo={logo}
            user={user}
            onSignOut={() => {
              onSignOut?.()
              onClose?.()
            }}
            sidebarLabel={sidebarLabel}
          />
        </aside>
      </div>
    </>
  )
}