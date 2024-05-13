import * as uuid from "uuid";
import {
  DynamoDBClient,
  DeleteItemCommand,
  DeleteItemCommandInput,
  DeleteItemCommandOutput,
  GetItemCommand,
  GetItemCommandInput,
  GetItemCommandOutput,
  PutItemCommand,
  PutItemCommandInput,
  PutItemCommandOutput
} from "@aws-sdk/client-dynamodb";

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})

const TABLE_NAME = 'CalendarParticipants'

export const getParticipants = async (calendarId: string): Promise<GetItemCommandOutput> => {
  const input: GetItemCommandInput = {
    Key: {
      CalendarId: {
        S: calendarId
      }
    },
    TableName: TABLE_NAME
  }
  return dbClient.send(new GetItemCommand(input))
}

export const getParticipant = async (calendarId: string, participantId: string): Promise<GetItemCommandOutput> => {
  const input: GetItemCommandInput = {
    Key: {
      ParticipantId: {
        S: participantId
      },
      CalendarId: {
        S: calendarId
      }
    },
    TableName: TABLE_NAME
  }
  return dbClient.send(new GetItemCommand(input))
}

export const createParticipant = async (participantName: string, calendarId: string, isOwner = false): Promise<string> => {
  const participantId = uuid.v4()
  const createdAt = new Date().getTime().toString()
  const input: PutItemCommandInput = {
    Item: {
      ParticipantId: {
        S: participantId
      },
      CalendarId: {
        S: calendarId
      },
      CreatedAt: {
        N: createdAt
      },
      ParticipantName: {
        S: participantId
      },
      IsOwner: {
        BOOL: isOwner
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: TABLE_NAME
  }
  await dbClient.send(new PutItemCommand(input))
  return calendarId
}

export const deleteCalendar = async (calendarId: string): Promise<DeleteItemCommandOutput> => {
  const input: DeleteItemCommandInput = {
    Key: {
      CalendarId: {
        S: calendarId
      }
    },
    TableName: TABLE_NAME
  }
  return dbClient.send(new DeleteItemCommand(input))
}

export const editCalendarName = async (calendarId: string, newCalendarName: string): Promise<PutItemCommandOutput> => {
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
  };
  return dbClient.send(new PutItemCommand(input))
}
