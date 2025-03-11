import { doc, getDoc, Timestamp } from 'firebase/firestore'
import { addBooking, Booking, cancelBooking } from '../../service/booking'
import { db } from '../../firebase'

const getBookingStart = (startTime: Timestamp | Date): Date =>
  startTime instanceof Timestamp ? startTime.toDate() : startTime

export const handleBooking = async (
  time: string,
  selectedDate: Date,
  user: { uid: string } | null,
  bookings: Booking[],
  setBookings: React.Dispatch<React.SetStateAction<Booking[]>>,
  showError: (message: string) => void,
  t: (key: string) => string,
  roomNumber: string,
) => {
  if (!user) {
    showError(t('errors.loginRequired'))
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
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      const userName = userDoc.exists() ? userDoc.data().name : 'Unknown'

      const endTime = new Date(startTime)
      endTime.setHours(startTime.getHours() + 1)

      const newBooking: Booking = {
        userId: user.uid,
        startTime: Timestamp.fromDate(startTime),
        endTime: Timestamp.fromDate(endTime),
        userName,
        roomNumber,
      }
      await addBooking(newBooking)

      setBookings(prev => [...prev, newBooking])
    }
  } catch (error) {
    console.error('Booking Error:', error)
    if (error instanceof Error) {
      if (error.message === 'FOREIGN_TIME_RESTRICTION') {
        showError(t('errors.foreignTime'))
      } else {
        showError(t('errors.bookingFailed'))
      }
    } else {
      showError(t('errors.bookingFailed'))
    }
  }
}
