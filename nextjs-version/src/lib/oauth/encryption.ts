import crypto from 'crypto'

const ALGORITHM = 'aes-256-gcm'
const ENCRYPTION_KEY = process.env.TOKEN_ENCRYPTION_KEY || crypto.randomBytes(32).toString('hex')

// Ensure the key is exactly 32 bytes
const getKey = (): Buffer => {
  const key = Buffer.from(ENCRYPTION_KEY.slice(0, 64), 'hex')
  if (key.length !== 32) {
    throw new Error('Encryption key must be 32 bytes (64 hex characters)')
  }
  return key
}

/**
 * Encrypts a token using AES-256-GCM
 * @param token - The token to encrypt
 * @returns Encrypted token in format: iv:authTag:encryptedData
 */
export function encryptToken(token: string): string {
  try {
    const iv = crypto.randomBytes(16)
    const cipher = crypto.createCipheriv(ALGORITHM, getKey(), iv)
    
    let encrypted = cipher.update(token, 'utf8', 'hex')
    encrypted += cipher.final('hex')
    
    const authTag = cipher.getAuthTag()
    
    // Return format: iv:authTag:encryptedData
    return `${iv.toString('hex')}:${authTag.toString('hex')}:${encrypted}`
  } catch (error) {
    console.error('Token encryption error:', error)
    throw new Error('Failed to encrypt token')
  }
}

/**
 * Decrypts a token encrypted with encryptToken
 * @param encryptedToken - The encrypted token string
 * @returns Decrypted token
 */
export function decryptToken(encryptedToken: string): string {
  try {
    const parts = encryptedToken.split(':')
    if (parts.length !== 3) {
      throw new Error('Invalid encrypted token format')
    }
    
    const [ivHex, authTagHex, encrypted] = parts
    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')
    
    const decipher = crypto.createDecipheriv(ALGORITHM, getKey(), iv)
    decipher.setAuthTag(authTag)
    
    let decrypted = decipher.update(encrypted, 'hex', 'utf8')
    decrypted += decipher.final('utf8')
    
    return decrypted
  } catch (error) {
    console.error('Token decryption error:', error)
    throw new Error('Failed to decrypt token')
  }
}

/**
 * Generates a secure random state parameter for OAuth
 * @returns Random state string
 */
export function generateState(): string {
  return crypto.randomBytes(32).toString('hex')
}

/**
 * Generates PKCE code verifier and challenge for OAuth 2.0
 * @returns Object with code_verifier and code_challenge
 */
export function generatePKCE(): { code_verifier: string; code_challenge: string } {
  const code_verifier = crypto.randomBytes(32).toString('base64url')
  const code_challenge = crypto
    .createHash('sha256')
    .update(code_verifier)
    .digest('base64url')
  
  return { code_verifier, code_challenge }
}
