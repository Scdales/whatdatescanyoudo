import { decrypt, encrypt } from '@/lib/utils/encrypt'

export const decryptCalPar = (encryptedString: string): { calendarId: string; participantId: string } => {
  return decrypt(encryptedString)
}

export const encryptCalPar = (calendarId: string, participantId = ''): string => {
  return encrypt({ calendarId, participantId })
}
