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

export default function Calendar({
  startDate,
  endDate,
  owner = '',
  selectedDates = {},
  userSelectedDates = [],
  calendarKey
}: {
  startDate: Date
  endDate: Date
  owner: string | null
  selectedDates: { [key: string]: number }
  userSelectedDates: Date[]
  calendarKey: string
}) {
  console.log(selectedDates, userSelectedDates)
  const { enqueueSnackbar } = useSnackbar()
  const [selectedDays, setSelectedDays] = useState([...userSelectedDates])

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
    const selectedCount = isDisabled ? 0 : selectedDates?.[format(props.day, DATE_PAYLOAD_FORMAT) || 0]
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
        style={{ color: 'black', display: 'flex', justifyContent: 'center' }}
      >
        <h4>{`${owner}'s Calendar`}</h4>
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
      <StaticDatePicker
        minDate={startDate}
        maxDate={endDate}
        slots={{ day: renderDay, toolbar: renderToolbar, actionBar: renderActions }}
        views={['day']}
      />
    </LocalizationProvider>
  )
}