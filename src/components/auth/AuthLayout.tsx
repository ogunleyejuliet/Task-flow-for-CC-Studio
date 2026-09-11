import type { ReactNode } from 'react'
import { Card } from '../Card/Card'
import { TaskflowLogo } from '../TaskflowLogo/TaskflowLogo'
import styles from './AuthLayout.module.css'

export interface AuthLayoutProps {
  subtitle?: string
  children: ReactNode
}

export function AuthLayout({ subtitle = 'Catalyst Creative Studio', children }: AuthLayoutProps) {
  return (
    <div className={styles.container}>
      <div className={styles.cardWrapper}>
        <div className={styles.logoWrapper}>
          <TaskflowLogo width={180} />
          {subtitle && <p className={styles.subTitle}>{subtitle}</p>}
        </div>
        <Card padded variant="elevated" className={styles.card}>

          {children}
        </Card>
      </div>
    </div>
  )
}
