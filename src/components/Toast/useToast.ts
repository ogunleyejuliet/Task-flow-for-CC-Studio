import { useContext, createContext } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastInput {
  title: string
  description?: string
  variant?: ToastVariant
  /** Auto-dismiss delay in ms. Set to `0` to keep it until dismissed. */
  duration?: number
}

export interface ToastOptions extends Omit<ToastInput, 'title'> {}

export interface ToastAPI {
  /** Fire a toast with the given settings. Returns its id. */
  push: (input: ToastInput) => string
  success: (title: string, description?: string, options?: ToastOptions) => string
  error: (title: string, description?: string, options?: ToastOptions) => string
  warning: (title: string, description?: string, options?: ToastOptions) => string
  info: (title: string, description?: string, options?: ToastOptions) => string
  dismiss: (id: string) => void
}

const ToastContext = createContext<ToastAPI | null>(null)

/** Re-export the provider element for use by the sibling Toaster. */
export { ToastContext }

export function useToast(): ToastAPI {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within a <ToastProvider>')
  return ctx
}