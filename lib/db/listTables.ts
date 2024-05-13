import { DynamoDBClient, ListTablesCommand } from '@aws-sdk/client-dynamodb'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})

export const listTables = async () => {
  try {
    const results = await dbClient.send(new ListTablesCommand())
    results.TableNames.forEach(function (item) {
      console.log(item)
    })
  } catch (err) {
    console.error(err)
  }
}

export default listTables
