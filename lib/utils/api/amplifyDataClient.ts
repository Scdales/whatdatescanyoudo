import { type Schema } from '@/amplify/data/resource'
import { generateServerClientUsingCookies } from '@aws-amplify/adapter-nextjs/data'
// @ts-ignore
import outputs from '@/amplify_outputs.json'
import { cookies } from 'next/headers'

export const cookieBasedClient = generateServerClientUsingCookies<Schema>({
  config: outputs,
  cookies
})
