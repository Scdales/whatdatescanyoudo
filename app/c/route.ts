import { NextRequest } from 'next/server'
import { createCalendar, deleteCalendar, editCalendarName, getCalendar } from '@/lib/utils/db/calendars'
import { createParticipant } from '@/lib/utils/db/participants'
import { encrypt, decrypt } from '@/lib/utils/encrypt'

export const encryptCalPar = (calendarId: string, participantId: string): string => {
  return encrypt({ calendarId, participantId })
}

export async function GET(req: NextRequest) {
  return new Response(undefined, { status: 418 })
}

export async function POST(req: Request) {
  const { title, owner, startDate, endDate } = await req.json()
  if (title && owner && startDate && endDate) {
    const calRes = await createCalendar(title, owner, startDate, endDate)
    const parRes = await createParticipant(calRes.calendarId, owner, true)
    const calendarParticipantKey = encryptCalPar(calRes.calendarId, parRes.participantId)
    return Response.json(calendarParticipantKey)
  }
  return new Response(undefined, { status: 400 })
}
