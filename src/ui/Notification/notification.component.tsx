import { FC, useEffect, useState } from 'react'
import { NotificationProps } from './notification.types'
import styles from './notification.module.scss'

export const Notification: FC<NotificationProps> = ({ message, onClose }) => {
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false)
      setTimeout(onClose, 300)
    }, 3000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!visible) return null

  return <div className={styles.notification}>{message}</div>
}
