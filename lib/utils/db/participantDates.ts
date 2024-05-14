import {
  DynamoDBClient,
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

const TABLE_NAME = 'ParticipantDates'

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
    TableName: TABLE_NAME
  }
  return dbClient.send(new PutItemCommand(input))
}

export type TGetParticipantDate = {
  participantDate: string
  isDeleted: boolean
  createdAt: string
}

export const getParticipantDates = async (participantId: string): Promise<TGetParticipantDate[]> => {
  const params: QueryCommandInput = {
    ExpressionAttributeValues: {
      ':c': { S: participantId }
    },
    Select: 'ALL_ATTRIBUTES',
    KeyConditionExpression: 'ParticipantId = :c',
    TableName: TABLE_NAME
  }
  const res = await dbClient.send(new QueryCommand(params))
  return res.Items?.map((item) => ({
    participantDate: item.ParticipantDate.S,
    createdAt: item.CreatedAt.S,
    isDeleted: item.IsDeleted.BOOL
  })) as TGetParticipantDate[]
}
