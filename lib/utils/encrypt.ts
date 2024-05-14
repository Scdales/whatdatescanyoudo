import { compressToEncodedURIComponent } from 'lz-string'

const crypto = require('crypto')
const algorithm = 'aes-256-cbc'
const password = process.env.PASSWORD
const key = crypto.scryptSync(password, process.env.SALT, 32)
const iv = Buffer.alloc(16, 0)
const lz = require('lz-string')

export function encrypt(data: any) {
  const text = JSON.stringify(data)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  const encryptedString = encrypted.toString('hex')
  // const compressedString = compressToEncodedURIComponent(encryptedString)
  // return compressedString
  return encryptedString
}

export function decrypt(text: string) {
  // const decompressedString = lz.decompressFromEncodedURIComponent(text)
  // let encryptedText = Buffer.from(decompressedString, 'hex')
  let encryptedText = Buffer.from(text, 'hex')
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  const decryptedString = decrypted.toString()
  const decryptedData = JSON.parse(decryptedString)
  return decryptedData
}
