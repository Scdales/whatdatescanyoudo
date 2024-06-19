'use client'

import { format, isSameDay } from 'date-fns'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { useState } from 'react'
import '@/styles/calendar.css'
import { DATE_PAYLOAD_FORMAT } from '../../constants'
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay/PickersDay'
import { useSearchParams } from 'next/navigation'
import type { TCalendar } from '@/lib/types/calendar'
import { getSelectedCount } from '@/lib/utils/fe/calendar'

const Calendar = ({ calendar }: { calendar: TCalendar }) => {
  const searchParams = useSearchParams()
  const calendarKey = searchParams.get('s') || ''
  const calendarSansParticipant: TCalendar = {
    ...calendar,
    participants: calendar.participants.filter((p) => p.id !== calendar.participantId)
  }
  const participant = calendar.participants.find((p) => p.id === calendar.participantId)
  const participantName = participant?.participantName || ''
  const participantSelectedDates = participant?.dates || []
  const [selectedDays, setSelectedDays] = useState(participantSelectedDates)

  function handleDayClick(day: Date) {
    const isSelected = selectedDays.find((selectedDay) => isSameDay(day, selectedDay))
    const date = format(day, DATE_PAYLOAD_FORMAT)
    if (isSelected) {
      fetch(`/p/${calendarKey}/${date}`, {
        method: 'delete',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setSelectedDays((selectedDays) => selectedDays.filter((selectedDay) => !isSameDay(selectedDay, day)))
    } else {
      fetch(`/p/${calendarKey}/${date}`, {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        }
      })
      setSelectedDays((selectedDays) => [...selectedDays, day])
    }
  }

  const renderDay = (props: PickersDayProps<Date>) => {
    const isDisabled = props.disabled
    const isSelected = selectedDays.findIndex((selectedDay) => isSameDay(props.day, selectedDay)) > -1
    let selectedCount = getSelectedCount(props.day, calendarSansParticipant)
    return (
      <PickersDay {...props} selected={isSelected} onDaySelect={handleDayClick}>
        {props.day.getDate()}
        <div style={{ display: !isDisabled && selectedCount ? 'flex' : 'none' }} className="day-number">
          {selectedCount}
        </div>
      </PickersDay>
    )
  }

  const renderToolbar = () => {
    return (
      <div
        className="MuiPickersToolbar-root MuiPickersLayout-toolbar"
        style={{ color: 'black', display: 'flex', justifyContent: 'center', flexDirection: 'column', borderBottom: '1px solid #ddd6d6' }}
      >
        <div style={{ fontSize: '24px' }} className="header-title">{`${calendar.ownerName}'s Calendar`}</div>
        <div style={{ fontSize: '16px', padding: '8px' }} className="header-title">
          {calendar.title}
        </div>
        <div style={{ fontSize: '12px', justifyContent: 'flex-end' }} className="header-title">
          {format(calendar.startDate, 'do MMM yy')} to {format(calendar.endDate, 'do MMM yy')}
        </div>
      </div>
    )
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ position: 'relative' }}>
        <div style={{ top: '-10%', width: '100%', textAlign: 'center', position: 'absolute' }}>Hi {participantName}!</div>
        <StaticDatePicker
          minDate={calendar.startDate}
          maxDate={calendar.endDate}
          slots={{ day: renderDay, toolbar: renderToolbar }}
          views={['day']}
        />
      </div>
    </LocalizationProvider>
  )
}

export default Calendar
