import React, { useState } from 'react'
import styles from './timeSlots.module.scss'
import { Timestamp } from 'firebase/firestore'
import { Booking, cancelBooking, getBookingsByDate } from '../../../../service/booking'
import { useTranslation } from 'react-i18next'
import { BookingModal } from '@ui/BookingModal/bookingModal.component'

interface TimeSlotsProps {
  timeSlots: string[]
  bookings: Booking[]
  selectedDate: Date
  handleBooking: (time: string, roomNumber: string) => void
  user: { uid: string } | null
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>
}

const getBookingTime = (booking: Booking): string => {
  return (
    booking.startTime instanceof Timestamp ? booking.startTime.toDate() : booking.startTime
  ).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}

const TimeSlots: React.FC<TimeSlotsProps> = ({
  timeSlots,
  bookings,
  handleBooking,
  selectedDate,
  user,
  setBookings,
}) => {
  const { t } = useTranslation()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleSlotClick = (time: string) => {
    const booking = bookings.find(b => getBookingTime(b) === time)

    if (booking) {
      if (booking.userId === user?.uid) {
        if (window.confirm(t('timeSlots.cancelConfirmation'))) {
          const startTimeTimestamp =
            booking.startTime instanceof Timestamp
              ? booking.startTime
              : Timestamp.fromDate(booking.startTime)

          cancelBooking(booking.userId, startTimeTimestamp)
            .then(() => {
              getBookingsByDate(selectedDate)
                .then(updatedBookings => {
                  setBookings(updatedBookings)
                })
                .catch(error => {
                  console.error(t('errors.bookingCancelError'), error)
                })
            })
            .catch(error => {
              console.error(t('errors.bookingCancelError'), error)
            })
        }
      }
      return
    }

    setSelectedTime(time)
    setIsModalOpen(true)
  }

  const handleConfirmBooking = (roomNumber: string) => {
    if (selectedTime) {
      handleBooking(selectedTime, roomNumber)
      setIsModalOpen(false)
    }
  }

  return (
    <div className={styles.timeline}>
      {timeSlots.map(time => {
        const booking = bookings.find(b => getBookingTime(b) === time)

        return (
          <div
            key={time}
            className={`${styles.slot} ${booking ? styles.slotBooked : styles.slotFree}`}
            onClick={() => handleSlotClick(time)}
          >
            {time}{' '}
            {booking
              ? `${t('timeSlots.slotBook')} (${t('room')}: ${booking.roomNumber}, ${booking.userName})`
              : t('timeSlots.slotFree')}
          </div>
        )
      })}
      {isModalOpen && selectedTime && (
        <BookingModal
          time={selectedTime}
          onClose={() => setIsModalOpen(false)}
          onConfirm={handleConfirmBooking}
        />
      )}
    </div>
  )
}

export default TimeSlots
