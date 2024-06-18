import type { Schema } from '@/amplify/data/resource'

export type TCalendarGetResponse = Schema['Calendar']['type'] & {
  participants: Schema['Participant']['type'][]
  participantId: string
}

export type TCalendar = Omit<TCalendarGetResponse, 'startDate' | 'endDate' | 'participants'> & {
  startDate: Date
  endDate: Date
  participants: (Omit<Schema['Participant']['type'], 'dates'> & { dates: Date[] })[]
}

export type TOwnerPayload = {
  title: string
  ownerName: string
  startDate: string
  endDate: string
}

export type TParticipantPayload = {
  participantName: string
}
