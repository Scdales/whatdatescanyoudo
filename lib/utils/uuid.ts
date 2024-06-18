import { ALPHA_NUMERIC_HYPHEN_REGEX } from '@/lib/constants'

export function isValidUuid(uuid: string) {
  const splitUuid = uuid.split('-')
  if (splitUuid.length !== 5) return false
  return splitUuid.every((segment) => segment.match(ALPHA_NUMERIC_HYPHEN_REGEX)?.length)
}

export function isValidAlphaNumeric(...args: string[]): boolean {
  return args?.every((arg) => arg.toString().match(ALPHA_NUMERIC_HYPHEN_REGEX)) || false
}
