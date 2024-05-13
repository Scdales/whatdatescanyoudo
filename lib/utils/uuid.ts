import { ALPHA_NUMERIC_HYPHEN_REGEX } from '../constants'

export function getNewUuid() {
  let uuid = '',
    i,
    random
  for (i = 0; i < 32; i++) {
    random = (Math.random() * 16) | 0
    if (i === 8 || i === 12 || i === 16 || i === 20) {
      uuid += '-'
    }
    uuid += (i === 12 ? 4 : i === 16 ? (random & 3) | 8 : random).toString(16)
  }

  return uuid
}

export function isValidUuid(uuid) {
  const splitUuid = uuid.split('-')
  if (splitUuid.length !== 5) return false
  return splitUuid.every((segment) => segment.match(ALPHA_NUMERIC_HYPHEN_REGEX)?.length)
}
