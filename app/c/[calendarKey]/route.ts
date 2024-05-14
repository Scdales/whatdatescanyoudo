import { NextRequest } from 'next/server'
import { deleteCalendar, editCalendarName, getCalendar } from '@/lib/utils/db/calendars'
import { decrypt } from '@/lib/utils/encrypt'
import { getParticipantDates } from '@/lib/utils/db/participants'

export const decryptCalPar = (encryptedString: string): { calendarId: string; participantId: string } => {
  return decrypt(encryptedString)
}

export async function GET(req: NextRequest, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  if (calendarKey) {
    const { calendarId, participantId } = decryptCalPar(calendarKey)
    const calendar = await getCalendar(calendarId)
    await getParticipantDates(participantId)
    return Response.json(calendar)
  }
  return new Response(undefined, { status: 400 })
}

export async function PUT(req: Request, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  const { title } = await req.json()
  if (calendarKey && title) {
    const { calendarId } = decryptCalPar(calendarKey)
    const res = await editCalendarName(calendarId, title)
    return Response.json(res, { status: 201 })
  }
  new Response(undefined, { status: 400 })
}

export async function DELETE(req: Request, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  const { id } = await req.json()
  if (calendarKey && id) {
    const { calendarId } = decryptCalPar(calendarKey)
    await deleteCalendar(calendarId)
    return new Response(undefined, { status: 204 })
  }
  return new Response(undefined, { status: 400 })
}
