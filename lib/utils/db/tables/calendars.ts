import { CreateTableInput } from '@aws-sdk/client-dynamodb'

export const calendarTableParams: CreateTableInput = {
  TableName: 'Calendars',
  AttributeDefinitions: [
    { AttributeName: 'CalendarId', AttributeType: 'S' }
    // CreatedAt
    // CalendarTitle
    // StartDate
    // EndDate
    // Participants
  ],
  KeySchema: [{ AttributeName: 'CalendarId', KeyType: 'HASH' }],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}
