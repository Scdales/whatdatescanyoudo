import * as uuid from 'uuid'

import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, GetCommand, PutCommand, UpdateCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { NextRequest } from 'next/server'

const dbClient = new DynamoDBClient({
  region: 'eu-west-1',
  endpoint: process.env.DYNAMO_HOST
})
const docClient = DynamoDBDocumentClient.from(dbClient)

export async function PUT(req: Request) {
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

  return Response.json(Item, { status: 201 })
}

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams
  const query = searchParams.get('id')
  const { Item } = await docClient.send(
    new GetCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: query }
      }
    })
  )

  return Response.json(Item)
}

export async function POST(req: Request) {
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

  return Response.json(Attributes)
}

export async function DELETE(req: Request) {
  const { id } = await req.json()
  await docClient.send(
    new DeleteCommand({
      TableName: process.env.TABLE_NAME,
      Key: {
        id: { S: id }
      }
    })
  )

  return new Response(undefined, { status: 204 })
}
