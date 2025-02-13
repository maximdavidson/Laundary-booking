import { useState } from 'react'
import styles from './bookingModal.module.scss'
import { useTranslation } from 'react-i18next'

interface BookingModalProps {
  time: string
  onClose: () => void
  onConfirm: (roomNumber: string) => void
}

export const BookingModal = ({ time, onClose, onConfirm }: BookingModalProps) => {
  const [number, setNumber] = useState('')
  const [error, setError] = useState('')
  const { t } = useTranslation()

  const handleSetNumber = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNumber(event.target.value)
  }

  const handleSubmit = () => {
    if (!number.trim()) {
      setError(t('errors.roomNumberRequired'))
      return
    }
    onConfirm(number)
    setNumber('')
    setError('')
  }
  return (
    <div className={styles.modal} onClick={onClose}>
      <div className={styles.modal_content} onClick={e => e.stopPropagation()}>
        <button className={styles.close_button} onClick={onClose}>
          ✖
        </button>
        <h2>{t('bookingModal.title', { time })}</h2>
        <div className={styles.input_group}>
          <input
            type='text'
            placeholder={t('bookingModal.roomPlaceholder')}
            value={number}
            onChange={handleSetNumber}
            className={error ? styles.error_input : styles.input}
          />
          {error && <span className={styles.error_message}>{error}</span>}
        </div>

        <button className={`${styles.button} ${styles.book}`} onClick={handleSubmit}>
          {t('bookingModal.submit')}
        </button>

        <div className={styles.rules}>
          <h5>{t('rules.title')}</h5>
          <ul>
            <li className={styles.rules_list}>{t('rules.point1')}</li>
            <li className={styles.rules_list}>{t('rules.point2')}</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
