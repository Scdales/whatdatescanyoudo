import { ALPHA_NUMERIC_HYPHEN_REGEX } from '@/lib/constants'

export function isValidAlphaNumeric(...args: string[]): boolean {
  return args?.every((arg) => arg.toString().match(ALPHA_NUMERIC_HYPHEN_REGEX)) || false
}
