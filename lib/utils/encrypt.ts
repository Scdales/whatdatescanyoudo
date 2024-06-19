import crypto from 'crypto'
const algorithm = 'aes-256-cbc'
const password = process.env?.PASSWORD || ''
const salt = process.env?.SALT || ''
const key = crypto.scryptSync(password, salt, 32)
const iv = Buffer.alloc(16, 0)

export function encrypt(data: any) {
  const text = JSON.stringify(data)
  const cipher = crypto.createCipheriv(algorithm, Buffer.from(key), iv)
  let encrypted = cipher.update(text)
  encrypted = Buffer.concat([encrypted, cipher.final()])
  return encrypted.toString('hex')
}

export function decrypt(text: string) {
  let encryptedText = Buffer.from(text, 'hex')
  let decipher = crypto.createDecipheriv(algorithm, Buffer.from(key), iv)
  let decrypted = decipher.update(encryptedText)
  decrypted = Buffer.concat([decrypted, decipher.final()])
  const decryptedString = decrypted.toString()
  return JSON.parse(decryptedString)
}
