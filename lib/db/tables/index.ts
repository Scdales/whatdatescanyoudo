import { calendarTableParams } from './calendars'
import { participantDates, calendarParticipants } from '@/lib/db/tables/participants'

const tableParams = [calendarTableParams, calendarParticipants, participantDates]

export default tableParams
