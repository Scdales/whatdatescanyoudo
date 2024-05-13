import { NextRequest } from 'next/server'
import { createCalendar, deleteCalendar, editCalendarName, getCalendar } from '@/lib/utils/db/calendars'

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get('id')
  if (query) {
    const res = await getCalendar(query)
    return Response.json(res)
  }
  return new Response(undefined, { status: 400 })
}

export async function POST(req: Request) {
  const { title, owner, startDate, endDate } = await req.json()
  if (title && owner && startDate && endDate) {
    const res = await createCalendar(title, owner, startDate, endDate)
    return Response.json(res)
  }
  return new Response(undefined, { status: 400 })
}

export async function PUT(req: Request) {
  const { id, title } = await req.json()
  if (id && title) {
    const res = await editCalendarName(id, title)
    return Response.json(res, { status: 201 })
  }
  new Response(undefined, { status: 400 })
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  if (id) {
    await deleteCalendar(id)
    return new Response(undefined, { status: 204 })
  }
  return new Response(undefined, { status: 400 })
}
