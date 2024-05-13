import { CreateTableInput } from '@aws-sdk/client-dynamodb'

export const calendarParticipants: CreateTableInput = {
  TableName: 'CalendarParticipants',
  AttributeDefinitions: [
    { AttributeName: 'CalendarId', AttributeType: 'S' },
    // ParticipantId
    // CreatedAt
    // ParticipantName
    // IsOwner
  ],
  KeySchema: [
    { AttributeName: 'CalendarId', KeyType: 'HASH' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}

export const participantDates: CreateTableInput = {
  TableName: 'ParticipantDates',
  AttributeDefinitions: [
    { AttributeName: 'ParticipantId', AttributeType: 'S' }
    // ParticipantDate
    // CalendarId
    // ParticipantName
    // CreatedAt
    // IsDeleted
    // DeletedTimestamp
  ],
  KeySchema: [
    { AttributeName: 'ParticipantId', KeyType: 'HASH' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}
