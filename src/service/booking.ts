import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Booking {
  userId: string
  startTime: Timestamp
  endTime: Timestamp
}

// Add bookind
export const addBooking = async (booking: Booking) => {
  const startOfSlot = Timestamp.fromDate(booking.startTime.toDate())
  const q = query(collection(db, 'bookings'), where('startTime', '==', startOfSlot))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    throw new Error('Этот слот уже занят')
  }

  const bookingId = `${booking.userId}_${booking.startTime.toMillis()}`

  await setDoc(doc(db, 'bookings', bookingId), {
    ...booking,
    startTime: Timestamp.fromDate(booking.startTime.toDate()),
    endTime: Timestamp.fromDate(booking.endTime.toDate()),
  })
}

// Canceled booking
export const cancelBooking = async (userId: string, startTime: Timestamp) => {
  const bookingId = `${userId}_${startTime.toMillis()}`
  await deleteDoc(doc(db, 'bookings', bookingId))
}

// Получение бронирований пользователя
export const getUserBookings = async (userId: string) => {
  const q = query(collection(db, 'bookings'), where('userId', '==', userId))
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      ...data,
      startTime: data.startTime.toDate(),
      endTime: data.endTime.toDate(),
    } as Booking
  })
}

// Получение всех бронирований на конкретную дату
export const getBookingsByDate = async (selectedDate: Date) => {
  const startOfDay = Timestamp.fromDate(new Date(selectedDate.setHours(0, 0, 0, 0)))
  const endOfDay = Timestamp.fromDate(new Date(selectedDate.setHours(23, 59, 59, 999)))

  const q = query(
    collection(db, 'bookings'),
    where('startTime', '>=', startOfDay),
    where('startTime', '<=', endOfDay),
  )

  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => {
    const data = doc.data()
    return {
      ...data,
      startTime: data.startTime.toDate(),
      endTime: data.endTime.toDate(),
    } as Booking
  })
}
