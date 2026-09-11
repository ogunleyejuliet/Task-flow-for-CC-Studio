import { useState, type FormEvent } from 'react'
import { AuthLayout } from './AuthLayout'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import { signInWithPassword } from '../../lib/supabase/auth'
import styles from './LoginPage.module.css'

export interface LoginPageProps {
  onNavigateToForgotPassword?: () => void
}

export function LoginPage({ onNavigateToForgotPassword }: LoginPageProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [emailError, setEmailError] = useState<string | null>(null)
  const [passwordError, setPasswordError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setEmailError(null)
    setPasswordError(null)

    let hasError = false
    if (!email.trim()) {
      setEmailError('Email is required')
      hasError = true
    }
    if (!password) {
      setPasswordError('Password is required')
      hasError = true
    }

    if (hasError) return

    setLoading(true)
    try {
      const { error: authError } = await signInWithPassword({
        email: email.trim(),
        password,
      })

      if (authError) {
        // Generic error message per security requirements in FR-6 (do not reveal if email vs password was wrong)
        setError('Invalid email or password.')
      }
    } catch (err) {
      console.error('Login error:', err)
      setError('An unexpected error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout subtitle="Catalyst Creative Studio Task Management">
      <h1 className={styles.title}>Welcome back</h1>
      <p className={styles.description}>Log in to access your TaskFlow dashboard</p>

      {error && (
        <div className={styles.alertError} role="alert">
          <Icon name="alert-circle" size={18} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}

      <form className={styles.form} onSubmit={handleSubmit} noValidate>
        <Input
          type="email"
          label="Email address"
          placeholder="you@catalyst.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={emailError ?? undefined}
          leadingIcon="mail"
          required
          autoComplete="email"
          disabled={loading}
        />

        <div>
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={passwordError ?? undefined}
            leadingIcon="lock"
            required
            autoComplete="current-password"
            disabled={loading}
          />
          {onNavigateToForgotPassword && (
            <div className={styles.forgotWrapper}>
              <button
                type="button"
                className={styles.forgotButton}
                onClick={onNavigateToForgotPassword}
                disabled={loading}
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={loading}
        >
          Sign In
        </Button>
      </form>

      <p className={styles.footerNote}>
        Internal application for Catalyst Creative Studio staff.
      </p>
    </AuthLayout>
  )
}
