import { calendarTableParams } from './calendars'
import { participantDates, calendarParticipants } from '@/lib/utils/db/tables/participants'

const tableParams = [calendarTableParams, calendarParticipants, participantDates]

export default tableParams
