import { ObjectID } from 'bson'
import { Request } from 'express'

export const parseBodyAsBuffer = async (req: Request) => {
  return new Promise((resolve, reject) => {
    const chunks = []
    req.on('error', (error) => reject(error))
    req.on('data', (chunk) => chunks.push(chunk))
    req.on('end', () => resolve(Buffer.concat(chunks)))
  })
}

export const parseBodyAsString = async (req: Request) => {
  const bodyAsBuffer = await parseBodyAsBuffer(req)
  return bodyAsBuffer.toString()
}

export const parseBodyAsJsonObject = async (req: Request) => {
  const bodyAsString = await parseBodyAsString(req)
  return JSON.parse(bodyAsString)
}

export const preInsertCheck = (values) => {
  if (Array.isArray(values)) {
    values.forEach(preInsertCheck)
    return
  }
  if (!values.id) {
    values.id = new ObjectID().toHexString()
  }
}
