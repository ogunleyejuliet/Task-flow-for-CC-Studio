import { AuthLayout } from './AuthLayout'
import { Button } from '../Button/Button'
import { Icon } from '../Icon/Icon'
import { useAuth } from '../../context/AuthContext'
import styles from './LoginPage.module.css'

export interface AccountNoticePageProps {
  status: 'pending' | 'disabled'
}

export function AccountNoticePage({ status }: AccountNoticePageProps) {
  const { signOut, user } = useAuth()

  const isPending = status === 'pending'

  return (
    <AuthLayout subtitle="Account Status Notice">
      <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
        <div
          style={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            backgroundColor: isPending ? '#FEF3C7' : '#FEE2E2',
            color: isPending ? '#D97706' : '#DC2626',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
          }}
        >
          <Icon name={isPending ? 'clock' : 'alert-circle'} size={24} aria-hidden="true" />
        </div>

        <h1 className={styles.title}>
          {isPending ? 'Account Activation Pending' : 'Account Deactivated'}
        </h1>

        <p className={styles.description} style={{ marginBottom: '1.5rem' }}>
          {isPending ? (
            <>
              Your account (<strong>{user?.email}</strong>) is currently pending activation.
              Please check your email inbox for the activation link to set your password and access TaskFlow.
            </>
          ) : (
            <>
              Your TaskFlow staff account (<strong>{user?.email}</strong>) has been deactivated.
              If you believe this is an error, please contact your Catalyst Creative Studio manager.
            </>
          )}
        </p>

        <Button variant="secondary" fullWidth onClick={signOut}>
          Sign Out
        </Button>
      </div>
    </AuthLayout>
  )
}
