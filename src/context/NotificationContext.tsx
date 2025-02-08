import { Notification } from '@ui/Notification/notification.component'
import { createContext, FC, ReactNode, useContext, useState } from 'react'

interface NotificationContextType {
  showError: (message: string) => void
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export const NotificationProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [error, setError] = useState<string | null>(null)

  const showError = (message: string) => {
    setError(message)
    setTimeout(() => {
      setError(null)
    }, 3500)
  }

  return (
    <NotificationContext.Provider value={{ showError }}>
      {children}
      {error && <Notification message={error} onClose={() => setError(null)} />}
    </NotificationContext.Provider>
  )
}

export const useNotification = (): NotificationContextType => {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotification should be use into NotificationProvider')
  }
  return context
}
