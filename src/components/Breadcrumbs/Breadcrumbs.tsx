import { Fragment, type ReactNode } from 'react'
import { cx } from '../../utils/cx'
import { Icon } from '../Icon'
import styles from './Breadcrumbs.module.css'

export interface BreadcrumbItem {
  label: ReactNode
  href?: string
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[]
  className?: string
}

export function Breadcrumbs({ items, className }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={cx(styles.root, className)}>
      <ol className={styles.list}>
        {items.map((item, index) => {
          const isLast = index === items.length - 1
          return (
            <Fragment key={index}>
              <li className={styles.item}>
                {isLast ? (
                  <span
                    className={cx(styles.label, styles.current)}
                    aria-current="page"
                  >
                    {item.label}
                  </span>
                ) : item.href ? (
                  <a className={styles.link} href={item.href}>
                    {item.label}
                  </a>
                ) : (
                  <span className={styles.label}>{item.label}</span>
                )}
              </li>
              {!isLast && (
                <li className={styles.separator} aria-hidden="true">
                  <Icon name="chevron-right" size={14} />
                </li>
              )}
            </Fragment>
          )
        })}
      </ol>
    </nav>
  )
}