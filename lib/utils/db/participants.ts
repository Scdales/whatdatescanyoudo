import * as uuid from 'uuid'
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
  PutItemCommandOutput,
  QueryCommand,
  QueryCommandInput
} from '@aws-sdk/client-dynamodb'

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

export const createParticipant = async (
  calendarId: string,
  participantName: string,
  isOwner = false
): Promise<{ participantId: string }> => {
  const participantId = uuid.v4()
  const createdAt = new Date().getTime().toString()
  const input: PutItemCommandInput = {
    Item: {
      CalendarId: {
        S: calendarId
      },
      ParticipantId: {
        S: participantId
      },
      CreatedAt: {
        N: createdAt
      },
      ParticipantName: {
        S: participantName
      },
      IsOwner: {
        BOOL: isOwner
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: TABLE_NAME
  }
  await dbClient.send(new PutItemCommand(input))
  return { participantId }
}

export const editParticipantDate = async (
  calendarId: string,
  participantId: string,
  date: string,
  toRemove: boolean
): Promise<PutItemCommandOutput> => {
  const createdAt = new Date().getTime().toString()
  const input: PutItemCommandInput = {
    Item: {
      CalendarId: {
        S: calendarId
      },
      ParticipantId: {
        S: participantId
      },
      ParticipantDate: {
        S: date
      },
      CreatedAt: {
        S: createdAt
      },
      IsDeleted: {
        BOOL: toRemove
      }
    },
    ReturnConsumedCapacity: 'TOTAL',
    TableName: 'ParticipantDates'
  }
  return dbClient.send(new PutItemCommand(input))
}

type TParticipantDate = {
  participantId: string
  participantDate: string
  isDeleted: string
  calendarId: string
  createdAt: string
}

export const getParticipantDates = async (participantId: string) => {
  const params: QueryCommandInput = {
    ExpressionAttributeValues: {
      ':c': { S: participantId }
    },
    Select: 'ALL_ATTRIBUTES',
    KeyConditionExpression: 'ParticipantId = :c',
    TableName: 'ParticipantDates'
  }
  const res = await dbClient.send(new QueryCommand(params))
  const dates = res.Items?.map((item) => ({
    participantDate: item.ParticipantDate.S,
    createdAt: item.CreatedAt.S,
    isDeleted: item.IsDeleted.BOOL
  }))
  console.log('DATES')
  console.log(dates)
  return dates
}
