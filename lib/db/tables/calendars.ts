export const calendarTableParams = {
  TableName: 'Calendars',
  AttributeDefinitions: [
    { AttributeName: 'createdTimestamp', AttributeType: 'S' },
    { AttributeName: 'calendar', AttributeType: 'M' },
    { AttributeName: 'createdBy', AttributeType: 'S' },
    { AttributeName: 'updatedTimestamp', AttributeType: 'S' },
    { AttributeName: 'updatedBy', AttributeType: 'S' },
    { AttributeName: 'participants', AttributeType: 'S' }
  ],
  KeySchema: [
    { AttributeName: 'createdTimestamp', KeyType: 'RANGE' },
    { AttributeName: 'createdBy', AttributeType: 'HASH' }
  ],
  ProvisionedThroughput: {
    ReadCapacityUnits: 100,
    WriteCapacityUnits: 100
  }
}
