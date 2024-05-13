import * as uuid from 'uuid'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})
const docClient = DynamoDBDocumentClient.from(dbClient)

export async function PUT(req, res) {
  const { content } = await req.json()
  const Item = {
    id: { S: uuid.v4() },
    content: { S: content }
  }
  await docClient.send(
    new PutCommand({
      TableName: process.env.TABLE_NAME,
      Item
    })
  )

  return res.status(201).json(Item)
}

export async function GET(req, res) {
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: req.query.id }
      }
    })
  )

  return res.status(200).json(Item)
}

export async function POST(req, res) {
  const { id, content } = await req.json()
  const { Attributes } = await docClient.send(
    new UpdateCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: id }
      },
      UpdateExpression: 'set content = :c',
      ExpressionAttributeValues: {
        ':c': { S: content }
      },
      ReturnValues: 'ALL_NEW'
    })
  )

  return res.status(200).json(Attributes)
}

export async function DELETE(req, res) {
  await docClient.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: req.body.id }
      }
    })
  )

  return res.status(204).json({})
}
