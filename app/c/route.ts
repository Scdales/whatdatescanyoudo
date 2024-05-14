import { NextRequest } from 'next/server'
import { createCalendar, deleteCalendar, editCalendarName, getCalendar } from '@/lib/utils/db/calendars'
import { createParticipant } from '@/lib/utils/db/participants'
import { encryptCalPar } from '@/lib/utils/api/calendar'

export async function GET(req: NextRequest) {
  return new Response('', { status: 418 })
}

export async function POST(req: Request) {
  const { title, owner, startDate, endDate } = await req.json()
  if (title && owner && startDate && endDate) {
    const calRes = await createCalendar(title, owner, startDate, endDate)
    const parRes = await createParticipant(calRes.calendarId, owner, true)
    const calendarKey = encryptCalPar(calRes.calendarId, parRes.participantId)
    const shareableKey = encryptCalPar(calRes.calendarId)
    return Response.json({ calendarKey, shareableKey })
  }
  return new Response('', { status: 400 })
}
