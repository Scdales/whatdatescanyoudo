import { TCalendar } from '@/app/page'
import { isSameDay } from 'date-fns'

export const getSelectedCount = (day: Date, calendar: TCalendar): number => {
  return calendar.participants.reduce((acc, curr) => {
    const hasParticipantSelectedDay = curr.dates.findIndex((date) => isSameDay(day, date.participantDate)) > -1
    if (hasParticipantSelectedDay) {
      return acc++
    }
    return acc
  }, 0)
}
