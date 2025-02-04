import React from 'react'
import styles from './timeSlots.module.scss'
import { Timestamp } from 'firebase/firestore'
import { Booking } from 'src/service/booking'
import { useTranslation } from 'react-i18next'

interface TimeSlotsProps {
  timeSlots: string[]
  bookings: Booking[]
  selectedDate: Date
  handleBooking: (time: string) => void
}

const TimeSlots: React.FC<TimeSlotsProps> = ({ timeSlots, bookings, handleBooking }) => {
  const { t } = useTranslation()
  return (
    <div className={styles.timeline}>
      {timeSlots.map(time => {
        const isBooked = bookings.some(b => {
          const bookingTime = (
            b.startTime instanceof Timestamp ? b.startTime.toDate() : b.startTime
          ).toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
          })

          return bookingTime === time
        })

        return (
          <div
            key={time}
            className={`${styles.slot} ${isBooked ? styles.slotBooked : styles.slotFree}`}
            onClick={() => handleBooking(time)}
          >
            {time} {isBooked ? t('timeSlots.slotBook') : t('timeSlots.slotFree')}
          </div>
        )
      })}
    </div>
  )
}

export default TimeSlots
