import { Timestamp } from 'firebase/firestore'
import { addBooking, Booking, cancelBooking } from '../../service/booking'

const getBookingStart = (startTime: Timestamp | Date): Date =>
  startTime instanceof Timestamp ? startTime.toDate() : startTime

export const handleBooking = async (
  time: string,
  selectedDate: Date,
  user: { uid: string } | null,
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
) => {
  if (!user) {
    alert('Для бронирования войдите в систему')
    return
  }

  const [hours, minutes] = time.split(':').map(Number)
  const startTime = new Date(selectedDate)
  startTime.setHours(hours, minutes, 0, 0)

  const existingBooking = bookings.find(b => {
    const bookingStart = getBookingStart(b.startTime)
    return b.userId === user.uid && bookingStart.getTime() === startTime.getTime()
  })

  try {
    if (existingBooking) {
      await cancelBooking(user.uid, Timestamp.fromDate(startTime))
      setBookings(prev =>
        prev.filter(b => getBookingStart(b.startTime).getTime() !== startTime.getTime()),
      )
    } else {
      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 1)
      await addBooking({
        userId: user.uid,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
      })

      setBookings(prev => [
        ...prev,
        {
          userId: user.uid,
          startTime: Timestamp.fromDate(startTime),
          endTime: Timestamp.fromDate(endTime),
        },
      ])
    }
  } catch (error) {
    console.error('Ошибка бронирования:', error)
    alert('Не удалось забронировать время')
  }
}
