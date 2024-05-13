import listTables from './lib/db/listTables'
import createTables from './lib/db/createTables'

export async function register() {
  await listTables()
  console.log('-- end list tables')
  await createTables()
  console.log('-- end create tables')
}
