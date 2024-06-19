import { cookies } from 'next/headers'

import { type Schema } from '@/amplify/data/resource'
// @ts-ignore
import outputs from '@/amplify_outputs.json'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies
})
