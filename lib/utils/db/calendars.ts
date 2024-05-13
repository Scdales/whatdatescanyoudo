import * as uuid from 'uuid'
import {
  DynamoDBClient,
  PutItemCommand,
  PutItemCommandInput,
  GetItemCommand,
  GetItemCommandInput,
  DeleteItemCommand,
  DeleteItemCommandInput
} from '@aws-sdk/client-dynamodb'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})

const TABLE_NAME = 'Calendars'

type TGetCalendar = {
  title: string
  owner: string
  id: string
  startDate: string
  endDate: string
}

export const getCalendar = async (calendarId: string): Promise<TGetCalendar> => {
  const input: GetItemCommandInput = {
    Key: {
      CalendarId: {
        S: calendarId
      }
    },
    TableName: TABLE_NAME
  }
  const calendar = await dbClient.send(new GetItemCommand(input))
  return {
    title: calendar.Item?.CalendarTitle.S,
    owner: calendar.Item?.Owner.S,
    id: calendar.Item?.CalendarId.S,
    startDate: calendar.Item?.StartDate.S,
    endDate: calendar.Item?.EndDate.S
  } as TGetCalendar
}

export const createCalendar = async (
  calendarTitle: string,
  owner: string,
  startDate: string,
  endDate: string
): Promise<{ calendarId: string }> => {
  const calendarId = uuid.v4()
  const createdAt = new Date().getTime().toString()
  const input: PutItemCommandInput = {
    Item: {
      CalendarId: {
        S: calendarId
      },
      CreatedAt: {
        N: createdAt
      },
      CalendarTitle: {
        S: calendarTitle
      },
      StartDate: {
        S: startDate
      },
      EndDate: {
        S: endDate
      },
      Owner: {
        S: owner
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: TABLE_NAME
  }
  await dbClient.send(new PutItemCommand(input))
  return { calendarId }
}

export const deleteCalendar = async (calendarId: string): Promise<void> => {
  const input: DeleteItemCommandInput = {
    Key: {
      CalendarId: {
        S: calendarId
      }
    },
    TableName: TABLE_NAME
  }
  await dbClient.send(new DeleteItemCommand(input))
  return
}

export const editCalendarName = async (calendarId: string, newCalendarName: string): Promise<void> => {
  const input: PutItemCommandInput = {
    Item: {
      CalendarId: {
        S: calendarId
      },
      CalendarTitle: {
        S: newCalendarName
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: TABLE_NAME
  }
  await dbClient.send(new PutItemCommand(input))
  return
}
