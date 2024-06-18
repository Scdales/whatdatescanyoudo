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
      console.error('Participant', participantId, 'exists')
    } else if (participantName) {
      const parRes = await cookieBasedClient.models.Participant.create({ calendarId, participantName })
      if (parRes.data?.id) {
        const calendarKey = encryptCalPar(calendarId, parRes.data.id)
        return Response.json({ calendarKey, shareableKey: '' }, { status: 200 })
      }
    } else {
      console.error('name not provided')
    }
  }
  new Response('', { status: 400 })
}
