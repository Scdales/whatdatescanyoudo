'use client'

import { isSameDay } from 'date-fns'
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker'
import { PickersDay } from '@mui/x-date-pickers/PickersDay'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFnsV3'
import { useState } from 'react'
import '../../../styles/calendar.css'
import { PickersActionBar } from '@mui/x-date-pickers'
import { useSnackbar } from 'notistack'
import { format } from 'date-fns'
import { DATE_PAYLOAD_FORMAT } from '../../constants'
import { PickersActionBarProps } from '@mui/x-date-pickers/PickersActionBar/PickersActionBar'
import { PickersDayProps } from '@mui/x-date-pickers/PickersDay/PickersDay'
import { useSearchParams } from 'next/navigation'
import { TCalendar } from '@/app/page'
import { getSelectedCount } from '@/lib/utils/calendar'

export default function Calendar({ calendar }: { calendar: TCalendar }) {
  const searchParams = useSearchParams()
  const calendarKey = searchParams.get('s') || ''
  const { enqueueSnackbar } = useSnackbar()
  const calendarSansParticipant: TCalendar = {
    ...calendar,
    participants: calendar.participants.filter((p) => p.participantId !== calendar.participantId)
  }
  const participant = calendar.participants.find((p) => p.participantId === calendar.participantId)
  const participantName = participant?.participantName || ''
  const participantSelectedDates = participant?.dates || []
  const parsedSelectedDates = participantSelectedDates.filter((d) => !d.isDeleted).map((d) => d.participantDate)
  const [selectedDays, setSelectedDays] = useState(parsedSelectedDates)

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
        <div style={{ fontSize: '24px' }} className="header-title">{`${calendar.owner}'s Calendar`}</div>
        <div style={{ fontSize: '16px', padding: '8px' }} className="header-title">
          {calendar.title}
        </div>
        <div style={{ fontSize: '12px', justifyContent: 'flex-end' }} className="header-title">
          {format(calendar.startDate, 'do MMM yy')} to {format(calendar.endDate, 'do MMM yy')}
        </div>
      </div>
    )
  }

  const onAccept = async () => {
    try {
      const payload = selectedDays.map((date) => format(date, DATE_PAYLOAD_FORMAT))
      const res = await fetch('/p', {
        method: 'put',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
      if (res.status === 200) {
        enqueueSnackbar('Saved')
      } else {
        enqueueSnackbar('Error while saving', { variant: 'error' })
      }
    } catch (e) {
      console.error(e)
      enqueueSnackbar('Error while saving', { variant: 'error' })
    }
  }

  const onClear = () => {
    setSelectedDays([])
  }

  const renderActions = (props: PickersActionBarProps) => {
    return <PickersActionBar {...props} actions={['accept']} onAccept={onAccept} />
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <div style={{ position: 'relative' }}>
        <div style={{ top: '-10%', width: '100%', textAlign: 'center', position: 'absolute' }}>Hi {participantName}!</div>
        <StaticDatePicker
          minDate={calendar.startDate}
          maxDate={calendar.endDate}
          slots={{ day: renderDay, toolbar: renderToolbar, actionBar: renderActions }}
          views={['day']}
        />
      </div>
    </LocalizationProvider>
  )
}
