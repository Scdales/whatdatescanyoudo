import { TCalendar } from '@/app/page'
import { isSameDay, parse } from 'date-fns'
import { TCalendarGetResponse } from '@/app/c/[calendarKey]/route'
import { DATE_PAYLOAD_FORMAT } from '@/lib/constants'

export const getSelectedCount = (day: Date, calendar: TCalendar): number => {
  return calendar.participants.reduce((acc, curr) => {
    const hasParticipantSelectedDay = curr.dates.findIndex((date) => !date.isDeleted && isSameDay(day, date.participantDate)) > -1
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
    owner: calendar.owner,
    participants: calendar.participants.map((participant) => {
      return {
        ...participant,
        dates: participant.dates.map((date) => ({
          ...date,
          participantDate: parse(date.participantDate, DATE_PAYLOAD_FORMAT, new Date())
        }))
      }
    })
  }
}
