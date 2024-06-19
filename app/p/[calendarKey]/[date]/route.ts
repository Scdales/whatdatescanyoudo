import { decryptCalPar } from '@/lib/utils/api/calendar'
import { isValidAlphaNumeric } from '@/lib/utils/uuid'
import { cookieBasedClient } from '@/lib/utils/api/amplifyDataClient'

export async function PUT(req: Request, ctx: { params: { calendarKey: string; date: string } }) {
  const {
    params: { calendarKey, date }
  } = ctx
  if (calendarKey && date && isValidAlphaNumeric(calendarKey, date)) {
    const { calendarId, participantId } = decryptCalPar(calendarKey)
    const participant = await cookieBasedClient.models.Participant.get({ id: participantId })
    const updatedDates = participant?.data?.dates ? [...participant.data.dates, date] : [date]
    await cookieBasedClient.models.Participant.update({ calendarId, id: participantId, dates: updatedDates })
    return new Response('OK', { status: 201 })
  }
  return new Response('Invalid data supplied', { status: 400 })
}

export async function DELETE(req: Request, ctx: { params: { calendarKey: string; date: string } }) {
  const {
    params: { calendarKey, date }
  } = ctx
  if (calendarKey && date && isValidAlphaNumeric(calendarKey, date)) {
    const { calendarId, participantId } = decryptCalPar(calendarKey)
    const participant = await cookieBasedClient.models.Participant.get({ id: participantId })
    const updatedDates = participant?.data?.dates ? participant?.data?.dates.filter((savedDate) => savedDate !== date) : []
    await cookieBasedClient.models.Participant.update({ calendarId, id: participantId, dates: updatedDates })
    return new Response('OK', { status: 200 })
  }
  return new Response('Invalid data supplied', { status: 400 })
}
