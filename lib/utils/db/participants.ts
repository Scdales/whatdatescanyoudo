import * as uuid from 'uuid'
import { DynamoDBClient, PutItemCommand, PutItemCommandInput, QueryCommand, QueryCommandInput } from '@aws-sdk/client-dynamodb'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})

const TABLE_NAME = 'CalendarParticipants'

export type TGetParticipant = {
  participantId: string
  participantName: string
  isOwner: boolean
  createdAt: string
}

export const getParticipants = async (calendarId: string): Promise<TGetParticipant[]> => {
  const params: QueryCommandInput = {
    ExpressionAttributeValues: {
      ':c': { S: calendarId }
    },
    Select: 'ALL_ATTRIBUTES',
    KeyConditionExpression: 'CalendarId = :c',
    TableName: TABLE_NAME
  }
  const res = await dbClient.send(new QueryCommand(params))
  const participants = res.Items?.map((item) => ({
    participantId: item.ParticipantId.S,
    participantName: item.ParticipantName.S,
    isOwner: item.IsOwner.BOOL,
    createdAt: item.CreatedAt.N
  })) as TGetParticipant[]
  return participants
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
