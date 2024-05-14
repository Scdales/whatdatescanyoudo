import { editParticipantDate } from '@/lib/utils/db/participantDates'
import { decryptCalPar } from '@/lib/utils/api/calendar'

export async function PUT(req: Request, ctx: { params: { calendarKey: string; date: string } }) {
  const {
    params: { calendarKey, date }
  } = ctx
  if (calendarKey && date) {
    const { calendarId, participantId } = decryptCalPar(calendarKey)
    await editParticipantDate(calendarId, participantId, date, false)
    return Response.json('OK', { status: 201 })
  }
  new Response('', { status: 400 })
}

export async function DELETE(req: Request, ctx: { params: { calendarKey: string; date: string } }) {
  const {
    params: { calendarKey, date }
  } = ctx
  if (calendarKey && date) {
    const { calendarId, participantId } = decryptCalPar(calendarKey)
    await editParticipantDate(calendarId, participantId, date, true)
    return new Response('OK', { status: 200 })
  }
  return new Response('', { status: 400 })
}
