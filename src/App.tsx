import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { ToastProvider } from './index'
import { LoginPage } from './components/auth/LoginPage'
import { ForgotPasswordPage } from './components/auth/ForgotPasswordPage'
import { SetPasswordPage } from './components/auth/SetPasswordPage'
import { AccountNoticePage } from './components/auth/AccountNoticePage'
import { DashboardPage } from './components/dashboard/DashboardPage'
import { Showcase } from './showcase/Showcase'
import { Spinner } from './components/Spinner/Spinner'
import { TaskflowLogo } from './components/TaskflowLogo/TaskflowLogo'
import { supabase } from './lib/supabase/client'

function AppContent() {
  const { session, loading, accountStatus } = useAuth()
  const [view, setView] = useState<'login' | 'forgot-password' | 'set-password' | 'showcase'>('login')
  const [isRecoveryFlow, setIsRecoveryFlow] = useState(false)

  useEffect(() => {
    // Detect password recovery or invite activation hash token in URL
    const hash = window.location.hash
    if (hash && (hash.includes('type=recovery') || hash.includes('type=invite') || hash.includes('access_token'))) {
      setIsRecoveryFlow(true)
      setView('set-password')
    }

    // Subscribe to auth events for PASSWORD_RECOVERY
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'PASSWORD_RECOVERY') {
        setIsRecoveryFlow(true)
        setView('set-password')
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  // Show design showcase if explicitly opened
  if (view === 'showcase') {
    return (
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'fixed', top: 12, right: 12, zIndex: 9999 }}>
          <button
            type="button"
            style={{
              padding: '6px 12px',
              borderRadius: '6px',
              backgroundColor: '#2F6DB5',
              color: '#ffffff',
              border: 'none',
              cursor: 'pointer',
              fontWeight: 500,
              fontSize: '12px',
            }}
            onClick={() => setView('login')}
          >
            ← Back to App
          </button>
        </div>
        <Showcase />
      </div>
    )
  }

  // Loading state during session restoration & profile fetch
  if (loading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1rem',
          backgroundColor: '#F8FAFC',
        }}
      >
        <TaskflowLogo width={180} />
        <Spinner size={24} />
      </div>
    )
  }

  // Set password flow (activation / password reset)
  if (view === 'set-password') {
    return (
      <SetPasswordPage
        isActivation={!isRecoveryFlow && accountStatus === 'pending'}
        onSuccess={() => {
          setIsRecoveryFlow(false)
          window.location.hash = ''
          setView('login')
        }}
      />
    )
  }

  // Unauthenticated user route protection
  if (!session) {
    if (view === 'forgot-password') {
      return <ForgotPasswordPage onNavigateToLogin={() => setView('login')} />
    }
    return <LoginPage onNavigateToForgotPassword={() => setView('forgot-password')} />
  }

  // Authenticated user account status gating
  if (accountStatus === 'pending') {
    // If pending user has an active session (e.g. following invite link), show set password / activation
    if (session) {
      return (
        <SetPasswordPage
          isActivation={true}
          onSuccess={() => setView('login')}
        />
      )
    }
    return <AccountNoticePage status="pending" />
  }

  if (accountStatus === 'disabled') {
    return <AccountNoticePage status="disabled" />
  }

  // Active authenticated user dashboard
  return <DashboardPage onOpenShowcase={() => setView('showcase')} />
}

export function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ToastProvider>
  )
}

export default App