import { NextRequest } from 'next/server'
import { decryptCalPar } from '@/lib/utils/api/calendar'
import { isValidAlphaNumeric } from '@/lib/utils/uuid'
import { cookieBasedClient } from '@/lib/utils/api/amplifyDataClient'

export async function GET(req: NextRequest, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  if (calendarKey && isValidAlphaNumeric(calendarKey)) {
    try {
      const { calendarId, participantId } = decryptCalPar(calendarKey)
      const [calendar, participants] = await Promise.all([
        cookieBasedClient.models.Calendar.get({ id: calendarId }),
        cookieBasedClient.models.Participant.list({ filter: { calendarId: { eq: calendarId } } })
      ])
      if (calendar.data && participants.data) {
        const calendarWithParticipants = {
          ...calendar.data,
          participants: participants.data,
          participantId
        }
        return Response.json(calendarWithParticipants)
      }
      return new Response('Error retrieving calendar', { status: 500 })
    } catch (e) {
      console.error(e)
      return new Response('Error retrieving calendar', { status: 500 })
    }
  }
  return new Response('Invalid data supplied', { status: 400 })
}

export async function PUT(req: Request, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  const { title } = await req.json()
  if (calendarKey && title && isValidAlphaNumeric(calendarKey, title)) {
    const { calendarId } = decryptCalPar(calendarKey)
    const res = await cookieBasedClient.models.Calendar.update({ id: calendarId, title })
    return Response.json(res, { status: 201 })
  }
  return new Response('Invalid data supplied', { status: 400 })
}

export async function DELETE(req: Request, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  const { id } = await req.json()
  if (calendarKey && id && isValidAlphaNumeric(calendarKey, id)) {
    const { calendarId } = decryptCalPar(calendarKey)
    await cookieBasedClient.models.Calendar.delete({ id: calendarId })
    return new Response('OK', { status: 204 })
  }
  return new Response('Invalid data supplied', { status: 400 })
}
