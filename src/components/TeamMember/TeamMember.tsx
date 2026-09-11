import { cx } from '../../utils/cx'
import { Avatar } from '../Avatar'
import styles from './TeamMember.module.css'

export interface TeamMemberProps {
  name: string
  role?: string
  avatarUrl?: string | null
  status?: 'online' | 'away' | 'busy' | 'offline' | null
  className?: string
}

export function TeamMember({
  name,
  role,
  avatarUrl,
  status = null,
  className,
}: TeamMemberProps) {
  return (
    <div className={cx(styles.root, className)}>
      <Avatar name={name} src={avatarUrl} size="md" status={status} />
      <div className={styles.text}>
        <span className={styles.name}>{name}</span>
        {role && <span className={styles.role}>{role}</span>}
      </div>
    </div>
  )
}