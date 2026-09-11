import { useState, type FormEvent } from 'react'
import { AuthLayout } from './AuthLayout'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'
import { resetPasswordForEmail } from '../../lib/supabase/auth'
import styles from './LoginPage.module.css'

export interface ForgotPasswordPageProps {
  onNavigateToLogin: () => void
}

export function ForgotPasswordPage({ onNavigateToLogin }: ForgotPasswordPageProps) {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [emailError, setEmailError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setEmailError(null)

    if (!email.trim()) {
      setEmailError('Email is required')
      return
    }

    setLoading(true)
    try {
      await resetPasswordForEmail({
        email: email.trim(),
        redirectTo: `${window.location.origin}`,
      })
    } catch (err) {
      console.error('Password reset error:', err)
    } finally {
      setLoading(false)
      // Always set submitted to true to avoid revealing if the email exists in DB (non-enumeration principle)
      setSubmitted(true)
    }
  }

  return (
    <AuthLayout subtitle="Password Recovery">
      <h1 className={styles.title}>Reset your password</h1>

      {submitted ? (
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <p className={styles.description}>
            If an active account exists for <strong>{email}</strong>, you will receive an email with instructions to reset your password.
          </p>
          <Button variant="secondary" fullWidth onClick={onNavigateToLogin}>
            Return to Sign In
          </Button>
        </div>
      ) : (
        <>
          <p className={styles.description}>
            Enter your staff email address and we will send you a link to reset your password.
          </p>

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
              disabled={loading}
            />

            <Button
              type="submit"
              variant="primary"
              size="lg"
              fullWidth
              loading={loading}
            >
              Send Reset Link
            </Button>
          </form>

          <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
            <button
              type="button"
              className={styles.forgotButton}
              onClick={onNavigateToLogin}
              disabled={loading}
            >
              Back to Sign In
            </button>
          </div>
        </>
      )}
    </AuthLayout>
  )
}
