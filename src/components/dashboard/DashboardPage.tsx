import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Topbar } from '../Topbar/Topbar'
import { Sidebar, type SidebarSection } from '../Sidebar/Sidebar'
import { Card } from '../Card/Card'
import { Button } from '../Button/Button'
import { Avatar } from '../Avatar/Avatar'
import { TaskflowLogo } from '../TaskflowLogo/TaskflowLogo'
import { StaffManagementView } from '../staff/StaffManagementView'
import { ClientManagementView } from '../clients/ClientManagementView'
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
      ],
    },
  ]

  if (isManager) {
    sidebarSections.push({
      label: 'ADMIN',
      items: [
        { id: 'team', label: 'Team Members', icon: 'members' },
        { id: 'projects', label: 'Clients & Projects', icon: 'projects' },
      ],
    })
  }

  const handleNavigate = (id: string) => {
    // Authorization check: Non-managers cannot navigate to admin routes
    if (!isManager && (id === 'team' || id === 'projects')) {
      setActiveNav('dashboard')
      return
    }
    setActiveNav(id)
  }

  return (
    <div className={styles.layout}>
      <Topbar
        brand={<TaskflowLogo width={140} />}
        onMenuClick={() => setMobileMenuOpen(true)}
        user={{ name: displayName }}
        actions={
          onOpenShowcase ? (
            <Button variant="tertiary" size="sm" onClick={onOpenShowcase}>
              Design Showcase
            </Button>
          ) : undefined
        }
      />

      <div className={styles.body}>
        <Sidebar
          sections={sidebarSections}
          activeId={activeNav}
          onNavigate={handleNavigate}
          user={{
            name: displayName,
            role: userRole,
          }}
          onSignOut={signOut}
          open={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        <main className={styles.mainContent}>
          {activeNav === 'team' && isManager ? (
            <StaffManagementView />
          ) : activeNav === 'projects' && isManager ? (
            <ClientManagementView />
          ) : activeNav === 'team' || activeNav === 'projects' ? (
            <Card padded style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <h2 style={{ color: '#DC2626', margin: '0 0 0.5rem 0' }}>Access Denied</h2>
              <p style={{ color: '#4B5563', margin: 0 }}>
                You do not have administrative permissions to access this page. Manager authorization is required.
              </p>
              <div style={{ marginTop: '1.5rem' }}>
                <Button variant="primary" onClick={() => setActiveNav('dashboard')}>
                  Return to Dashboard
                </Button>
              </div>
            </Card>
          ) : (
            <>
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
                  Phase 3 Staff & Client Administration Active.
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  User access level identified as <strong>{accessLevel.toUpperCase()}</strong>.
                  {isManager
                    ? ' You have manager administrative controls enabled for Staff & Client Management.'
                    : ' Administrative controls are restricted to Manager role.'}
                </p>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  )
}

