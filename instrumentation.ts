import listTables from './lib/db/listTables'
import createTables from './lib/db/createTables'

export async function register() {
  console.log('-- start list tables')
  await listTables()
  console.log('-- end list tables')
  console.log('-- start create tables')
  await createTables()
  console.log('-- end create tables')
}
