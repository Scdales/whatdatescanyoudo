import { NextRequest } from 'next/server'
import { encryptCalPar } from '@/lib/utils/api/calendar'
import { isValidAlphaNumeric } from '@/lib/utils/uuid'
import { cookieBasedClient } from '@/lib/utils/api/amplifyDataClient'

export async function GET(req: NextRequest) {
  return new Response('', { status: 418 })
}

export async function POST(req: Request) {
  const { title, ownerName, startDate, endDate } = await req.json()
  try {
    if (title && ownerName && startDate && endDate && isValidAlphaNumeric(title, ownerName, startDate, endDate)) {
      const calRes = await cookieBasedClient.models.Calendar.create({
        title,
        ownerName,
        startDate,
        endDate
      })
      if (calRes.data?.id) {
        const parRes = await cookieBasedClient.models.Participant.create({
          calendarId: calRes?.data?.id,
          isOwner: true,
          participantName: ownerName
        })
        if (parRes.data?.id) {
          const calendarKey = encryptCalPar(calRes.data.id, parRes.data.id)
          const shareableKey = encryptCalPar(calRes.data.id)
          return Response.json({ calendarKey, shareableKey })
        }
        return new Response('Error creating owner participant', { status: 400 })
      }
      return new Response('Error creating calendar', { status: 400 })
    }
    return new Response('Invalid data supplied', { status: 400 })
  } catch (e) {
    console.error(e)
    return new Response('Error creating calendar', { status: 500 })
  }
}
