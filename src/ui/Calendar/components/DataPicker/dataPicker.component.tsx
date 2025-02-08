import React from 'react'
import styles from './dataPicker.module.scss'

interface DatePickerProps {
  selectedDate: Date
  onChange: (date: Date) => void
}

const DatePicker: React.FC<DatePickerProps> = ({ selectedDate, onChange }) => {
  const handleInputchange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(event.target.value)
    onChange(newDate)
  }

  return (
    <div className={styles.datePicker}>
      <input
        type='date'
        value={selectedDate.toISOString().split('T')[0]}
        onChange={handleInputchange}
      />
    </div>
  )
}

export default DatePicker
