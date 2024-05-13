import { CreateTableInput } from '@aws-sdk/client-dynamodb'

export const calendarTableParams: CreateTableInput = {
  TableName: 'Calendars',
  AttributeDefinitions: [
    { AttributeName: 'createdBy', AttributeType: 'S' },
    { AttributeName: 'createdTimestamp', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'createdBy', KeyType: 'HASH' },
    { AttributeName: 'createdTimestamp', KeyType: 'RANGE' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}
