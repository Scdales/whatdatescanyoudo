import { a, type ClientSchema, defineData } from '@aws-amplify/backend'

const schema = a.schema({
  Calendar: a
    .model({
      id: a.string(),
      title: a.string().required(),
      ownerName: a.string().required(),
      startDate: a.string().required(),
      endDate: a.string().required()
    })
    .authorization((allow) => [allow.publicApiKey()]),
  Participant: a
    .model({
      id: a.string(),
      calendarId: a.string().required(),
      participantName: a.string().required(),
      dates: a.string().required().array(),
      isOwner: a.boolean(),
      isDefault: a.boolean()
    })
    .authorization((allow) => [allow.publicApiKey()])
})

export type Schema = ClientSchema<typeof schema>

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'apiKey',
    apiKeyAuthorizationMode: {
      expiresInDays: 30
    }
  }
})
