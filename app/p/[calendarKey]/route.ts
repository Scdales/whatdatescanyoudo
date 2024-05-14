import { NextRequest } from 'next/server'
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
    const { participantId } = decryptCalPar(calendarKey)
    const res = getParticipantDates(participantId)
    return Response.json('OK', { status: 200 })
  }
  new Response(undefined, { status: 400 })
}
