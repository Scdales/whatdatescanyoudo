import listTables from './lib/db/listTables'
import createTables from './lib/db/createTables'

export async function register() {
  await listTables()
  await createTables()
  console.log('Done')
}
