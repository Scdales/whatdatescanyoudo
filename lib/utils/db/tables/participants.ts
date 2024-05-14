import { CreateTableInput } from '@aws-sdk/client-dynamodb'

export const calendarParticipants: CreateTableInput = {
  TableName: 'CalendarParticipants',
  AttributeDefinitions: [
    { AttributeName: 'CalendarId', AttributeType: 'S' },
    { AttributeName: 'ParticipantId', AttributeType: 'S' }
    // CreatedAt
    // ParticipantName
    // IsOwner
  ],
  KeySchema: [
    { AttributeName: 'CalendarId', KeyType: 'HASH' },
    { AttributeName: 'ParticipantId', KeyType: 'RANGE' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}

export const participantDates: CreateTableInput = {
  TableName: 'ParticipantDates',
  AttributeDefinitions: [
    { AttributeName: 'ParticipantId', AttributeType: 'S' },
    { AttributeName: 'ParticipantDate', AttributeType: 'S' }
    // CalendarId
    // ParticipantName
    // CreatedAt
    // IsDeleted
  ],
  KeySchema: [
    { AttributeName: 'ParticipantId', KeyType: 'HASH' },
    { AttributeName: 'ParticipantDate', KeyType: 'RANGE' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 5,
    WriteCapacityUnits: 5
  }
}
