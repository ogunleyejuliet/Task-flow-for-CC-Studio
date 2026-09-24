import { useState, type FormEvent } from 'react'
import { AuthLayout } from './AuthLayout'
import { Input } from '../Input/Input'
import { Button } from '../Button/Button'
import { useToast } from '../../index'
import { supabase } from '../../lib/supabase/client'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginPage.module.css'

export interface SetPasswordPageProps {
  onSuccess?: () => void
  isActivation?: boolean
}

export function SetPasswordPage({ onSuccess, isActivation = true }: SetPasswordPageProps) {
  const { user, refreshProfile } = useAuth()
  const toast = useToast()

  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setErrorMsg(null)

    if (password.length < 8) {
      setErrorMsg('Password must be at least 8 characters long.')
      return
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      // 1. Update user password in Supabase Auth
      const { error: authErr } = await supabase.auth.updateUser({
        password,
      })

      if (authErr) {
        setErrorMsg(authErr.message)
        setSubmitting(false)
        return
      }

      // 2. If user exists, ensure profile account_status becomes active
      if (user?.id) {
        await supabase
          .from('profiles')
          .update({
            account_status: 'active',
            updated_at: new Date().toISOString(),
          })
          .eq('id', user.id)

        await refreshProfile()
      }

      toast.push({
        title: isActivation ? 'Account Activated' : 'Password Updated',
        description: isActivation
          ? 'Your password has been set and your account is now active.'
          : 'Your password has been successfully reset.',
        variant: 'success',
      })

      if (onSuccess) {
        onSuccess()
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'An unexpected error occurred.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AuthLayout
      subtitle={
        isActivation
          ? 'Welcome to TaskFlow! Set a secure password to activate your account.'
          : 'Enter a new password for your TaskFlow account.'
      }
    >
      <form onSubmit={handleSubmit} className={styles.form} noValidate>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#111827', margin: '0 0 1rem 0', textAlign: 'center' }}>
          {isActivation ? 'Activate Your Account' : 'Set New Password'}
        </h2>

        {errorMsg && (
          <div
            style={{
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              backgroundColor: '#FEE2E2',
              border: '1px solid #FCA5A5',
              color: '#991B1B',
              fontSize: '0.875rem',
              lineHeight: 1.4,
            }}
            role="alert"
          >
            {errorMsg}
          </div>
        )}

        <Input
          label="New Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="At least 8 characters"
          helperText="Minimum 8 characters required."
        />

        <Input
          label="Confirm New Password"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Re-enter your new password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          fullWidth
          loading={submitting}
        >
          {isActivation ? 'Set Password & Activate' : 'Update Password'}
        </Button>
      </form>
    </AuthLayout>
  )
}
