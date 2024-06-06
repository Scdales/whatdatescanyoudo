import { NextRequest } from 'next/server'
import { decryptCalPar, encryptCalPar } from '@/lib/utils/api/calendar'
import { createParticipant } from '@/lib/utils/db/participants'
import {isValidAlphaNumeric} from "@/lib/utils/uuid";

// export async function GET(req: NextRequest, ctx: { params: { calendarKey: string } }) {
//   const {
//     params: { calendarKey }
//   } = ctx
//   if (calendarKey) {
//     const { participantId } = decryptCalPar(calendarKey)
//     const participantDates = await getParticipantDates(participantId)
//     return Response.json(participantDates, { status: 200 })
//   }
//   new Response('', { status: 400 })
// }

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
      const { participantId } = await createParticipant(calendarId, participantName)
      const calendarKey = encryptCalPar(calendarId, participantId)
      return Response.json({ calendarKey, shareableKey: '' }, { status: 200 })
    } else {
      console.error('name not provided')
    }
  }
  new Response('', { status: 400 })
}
