import { CreateTableInput } from '@aws-sdk/client-dynamodb'

export const calendarTableParams: CreateTableInput = {
  TableName: 'Calendars',
  AttributeDefinitions: [
    { AttributeName: 'createdTimestamp', AttributeType: 'S' },
    { AttributeName: 'calendar', AttributeType: 'S' },
    { AttributeName: 'createdBy', AttributeType: 'S' },
    { AttributeName: 'updatedTimestamp', AttributeType: 'S' },
    { AttributeName: 'updatedBy', AttributeType: 'S' },
    { AttributeName: 'participants', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'createdTimestamp', KeyType: 'RANGE' },
    { AttributeName: 'createdBy', KeyType: 'HASH' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 100,
    WriteCapacityUnits: 100
  }
}
