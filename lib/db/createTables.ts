import { DynamoDBClient, CreateTableCommand } from '@aws-sdk/client-dynamodb'
import tableParams from './tables'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST,
})

export const createTables = async () => {
  try {
    for (let i = 0; i < tableParams.length; i++) {
      try {
        await dbClient.send(new CreateTableCommand(tableParams[i]))
        console.log('created', tableParams[i].TableName)
      } catch (err: any) {
        if (!err.toString().includes('Cannot create preexisting table')) {
          throw err
        } else {
          console.log(tableParams[i].TableName, 'already exists')
        }
      }
    }
  } catch (err) {
    console.log('Error', err)
  }
}

export default createTables
