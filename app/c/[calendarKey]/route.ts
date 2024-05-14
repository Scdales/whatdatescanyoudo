import { NextRequest } from 'next/server'
import { deleteCalendar, editCalendarName, getCalendar, TGetCalendar } from '@/lib/utils/db/calendars'
import { decrypt } from '@/lib/utils/encrypt'
import { getParticipantDates, TGetParticipantDate } from '@/lib/utils/db/participantDates'
import { getParticipants, TGetParticipant } from '@/lib/utils/db/participants'

export const decryptCalPar = (encryptedString: string): { calendarId: string; participantId: string } => {
  return decrypt(encryptedString)
}

export type TCalendarGetResponse = TGetCalendar & {
  participants: (TGetParticipant & { dates: TGetParticipantDate[] })[]
  participantId: string
}

export async function GET(req: NextRequest, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  if (calendarKey) {
    const { calendarId, participantId } = decryptCalPar(calendarKey)
    const [calendar, participants] = await Promise.all([getCalendar(calendarId), getParticipants(calendarId)])
    const participantDates = await Promise.all(participants.map((participant) => getParticipantDates(participant.participantId)))
    const calendarWithParticipants: TCalendarGetResponse = {
      ...calendar,
      participants: participants.map((participant, i) => ({ ...participant, dates: participantDates[i] })),
      participantId
    }
    return Response.json(calendarWithParticipants)
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
