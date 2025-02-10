import { useAuth } from '@context/AuthСontext'
import styles from './calendar.module.scss'
import { useEffect, useState } from 'react'
import { TIME_SLOTS } from '@constants/calendarTimeslots'
import { Booking, getBookingsByDate } from '../../service/booking'
import { handleBooking } from '@ui/utils/bookingUtil'
import DatePicker from './components/DataPicker/dataPicker.component'
import TimeSlots from './components/TimeSlots/timeSlots.component'
import { useTranslation } from 'react-i18next'
import { useNotification } from '@context/NotificationContext'

export const BookingCalendar = () => {
  const { user } = useAuth()
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const { showError } = useNotification()
  const { t } = useTranslation()

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      const bookings = await getBookingsByDate(selectedDate)
      setBookings(bookings)
      setLoading(false)
    }

    loadBookings()
  }, [selectedDate])

  return (
    <div className={styles.container}>
      <DatePicker selectedDate={selectedDate} onChange={setSelectedDate} />
      {loading ? (
        <div className={styles.loading}>{t('loading.booking')}</div>
      ) : (
        <TimeSlots
          timeSlots={TIME_SLOTS}
          bookings={bookings}
          selectedDate={selectedDate}
          handleBooking={(time: string) =>
            handleBooking(time, selectedDate, user, bookings, setBookings, showError, t)
          }
        />
      )}
    </div>
  )
}
