import { NextRequest } from 'next/server'
import { getCalendar } from '@/lib/utils/db/calendars'

export async function GET(req: NextRequest, ctx: { params: { calendarId: string } }) {
  const {
    params: { calendarId }
  } = ctx
  if (calendarId) {
    const calendar = await getCalendar(calendarId)
    return Response.json(calendar)
  }
  return new Response(undefined, { status: 400 })
}
