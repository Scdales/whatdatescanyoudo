import { NextRequest, NextResponse } from 'next/server'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { getCalendar } from '@/lib/utils/db/calendars'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})
const docClient = DynamoDBDocumentClient.from(dbClient)

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
