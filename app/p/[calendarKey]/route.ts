import { NextRequest } from 'next/server'
import { decryptCalPar, encryptCalPar } from '@/lib/utils/api/calendar'
import { isValidAlphaNumeric } from '@/lib/utils/uuid'
import { cookieBasedClient } from '@/lib/utils/api/amplifyDataClient'

export async function POST(req: NextRequest, ctx: { params: { calendarKey: string } }) {
  const {
    params: { calendarKey }
  } = ctx
  if (calendarKey && isValidAlphaNumeric(calendarKey)) {
    const { participantId, calendarId } = decryptCalPar(calendarKey)
    const { participantName } = await req.json()
    if (participantId) {
      return new Response (`Participant ${participantId} exists`, { status: 400 })
    } else if (participantName) {
      const parRes = await cookieBasedClient.models.Participant.create({ calendarId, participantName })
      if (parRes.data?.id) {
        const calendarKey = encryptCalPar(calendarId, parRes.data.id)
        return Response.json({ calendarKey, shareableKey: '' }, { status: 200 })
      }
    } else {
      return new Response('Name not supplied', { status: 400 })
    }
  }
  return new Response('Invalid data supplied', { status: 400 })
}
