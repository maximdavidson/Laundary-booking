import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  Timestamp,
  where,
} from 'firebase/firestore'
import { db } from '../firebase'

export interface Booking {
  userId: string
  userName: string
  startTime: Timestamp
  endTime: Timestamp
  roomNumber: string
}

// Add bookind
export const addBooking = async (booking: Booking) => {
  const userDoc = await getDoc(doc(db, 'users', booking.userId))
  const userName = userDoc.exists() ? userDoc.data().name : 'Unknown'

  const isForeignName = !/[\u0400-\u04FF]/i.test(userName)
  if (isForeignName) {
    const startDate = booking.startTime.toDate()
    const endDate = booking.endTime.toDate()

    const startMinutes = startDate.getHours() * 60 + startDate.getMinutes()
    const endMinutes = endDate.getHours() * 60 + endDate.getMinutes()
    const minAllowed = 18 * 60
    const maxAllowed = 21 * 60

    if (startMinutes < minAllowed || endMinutes > maxAllowed) {
      throw new Error('FOREIGN_TIME_RESTRICTION')
    }
  }

  const startOfSlot = Timestamp.fromDate(booking.startTime.toDate())
  const q = query(collection(db, 'bookings'), where('startTime', '==', startOfSlot))
  const snapshot = await getDocs(q)

  if (!snapshot.empty) {
    throw new Error('This slot is already booked')
  }

  const bookingId = `${booking.userId}_${booking.startTime.toMillis()}`
  await setDoc(doc(db, 'bookings', bookingId), {
    ...booking,
    userName,
    roomNumber: booking.roomNumber,
    startTime: Timestamp.fromDate(booking.startTime.toDate()),
    endTime: Timestamp.fromDate(booking.endTime.toDate()),
  })
}

// Canceled booking
export const cancelBooking = async (userId: string, startTime: Timestamp) => {
  const bookingId = `${userId}_${startTime.toMillis()}`
  await deleteDoc(doc(db, 'bookings', bookingId))
}

// Get user bookings
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

// Get bookings by date
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
      userName: data.userName,
    } as unknown as Booking
  })
}
