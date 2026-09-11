import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Topbar } from '../Topbar/Topbar'
import { Sidebar, type SidebarSection } from '../Sidebar/Sidebar'
import { Card } from '../Card/Card'
import { Button } from '../Button/Button'
import { Avatar } from '../Avatar/Avatar'
import { TaskflowLogo } from '../TaskflowLogo/TaskflowLogo'
import styles from './DashboardPage.module.css'

export interface DashboardPageProps {
  onOpenShowcase?: () => void
}

export function DashboardPage({ onOpenShowcase }: DashboardPageProps) {
  const { user, profile, isManager, accessLevel, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeNav, setActiveNav] = useState('dashboard')
  const [viewScope, setViewScope] = useState<'all' | 'my'>(isManager ? 'all' : 'my')

  const displayName = profile?.full_name || user?.email?.split('@')[0] || 'Team Member'
  const userRole = profile?.role || (isManager ? 'Project Manager' : 'Team Member')

  const sidebarSections: SidebarSection[] = [
    {
      items: [
        { id: 'dashboard', label: 'Dashboard', icon: 'grid' },
      ],
    },
    {
      label: 'WORK',
      items: [
        { id: 'my-tasks', label: 'My Tasks', icon: 'tasks' },
        { id: 'projects', label: 'Clients & Projects', icon: 'projects' },
      ],
    },
  ]

  if (isManager) {
    sidebarSections.push({
      label: 'ADMIN',
      items: [
        { id: 'team', label: 'Team Members', icon: 'members' },
      ],
    })
  }

  return (
    <div className={styles.layout}>
      <Topbar
        brand={<TaskflowLogo width={140} />}
        onMenuClick={() => setMobileMenuOpen(true)}
        user={{ name: displayName }}
        actions={
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {onOpenShowcase && (
              <Button variant="tertiary" size="sm" onClick={onOpenShowcase}>
                Design Showcase
              </Button>
            )}
            <Button variant="secondary" size="sm" leadingIcon="logout" onClick={signOut}>
              Sign Out
            </Button>
          </div>
        }
      />

      <div className={styles.body}>
        <Sidebar
          sections={sidebarSections}
          activeId={activeNav}
          onNavigate={(id) => setActiveNav(id)}
          user={{
            name: displayName,
            role: userRole,
          }}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className={styles.mainContent}>
          <div className={styles.headerBanner}>
            <div>
              <h1 className={styles.welcomeText}>Welcome back, {displayName}</h1>
              <p className={styles.subText}>Catalyst Creative Studio Task Management</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              <span className={isManager ? styles.badgeManager : styles.badgeStaff}>
                {accessLevel.toUpperCase()} ACCESS
              </span>
            </div>
          </div>

          <Card padded variant="elevated" className={styles.userInfoCard}>

            <Avatar name={displayName} size="md" />
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600 }}>{displayName}</h3>
                <span className={isManager ? styles.badgeManager : styles.badgeStaff}>
                  {accessLevel}
                </span>
              </div>
              <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#4b5563' }}>
                {user?.email} {profile?.department ? `• ${profile.department}` : ''} {profile?.role ? `(${profile.role})` : ''}
              </p>
            </div>
          </Card>

          {isManager && (
            <div className={styles.toggleContainer}>
              <button
                type="button"
                className={`${styles.toggleButton} ${viewScope === 'all' ? styles.toggleActive : ''}`}
                onClick={() => setViewScope('all')}
              >
                All Team Tasks
              </button>
              <button
                type="button"
                className={`${styles.toggleButton} ${viewScope === 'my' ? styles.toggleActive : ''}`}
                onClick={() => setViewScope('my')}
              >
                My Tasks
              </button>
            </div>
          )}

          <div style={{ padding: '2rem 0', textAlign: 'center', color: '#6b7280' }}>
            <p style={{ fontSize: '1rem', fontWeight: 500 }}>
              Phase 2 Authentication and Access Control verified.
            </p>
            <p style={{ fontSize: '0.875rem' }}>
              User access level identified as <strong>{accessLevel.toUpperCase()}</strong>.
              {isManager
                ? ' You have full manager authorization to view all team tasks.'
                : ' You are scoped to your assigned tasks.'}
            </p>
          </div>
        </main>
      </div>
    </div>
  )
}
