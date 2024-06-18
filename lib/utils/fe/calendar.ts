import { isSameDay, parse } from 'date-fns'
import type { TCalendar, TCalendarGetResponse } from '../../types/calendar'
import { DATE_PAYLOAD_FORMAT } from '@/lib/constants'

export const getSelectedCount = (day: Date, calendar: TCalendar): number => {
  return calendar.participants.reduce((acc, curr) => {
    const hasParticipantSelectedDay = curr.dates.findIndex((date) => isSameDay(day, date)) > -1
    if (hasParticipantSelectedDay) {
      return acc + 1
    }
    return acc
  }, 0)
}

export const parseCalendarInfo = (calendar: TCalendarGetResponse): TCalendar => {
  return {
    ...calendar,
    startDate: parse(calendar.startDate, DATE_PAYLOAD_FORMAT, new Date()),
    endDate: parse(calendar.endDate, DATE_PAYLOAD_FORMAT, new Date()),
    ownerName: calendar.ownerName,
    participants: calendar.participants.map((participant) => {
      return {
        ...participant,
        dates: participant?.dates?.map((date) => parse(date, DATE_PAYLOAD_FORMAT, new Date())) || []
      }
    })
  }
}
