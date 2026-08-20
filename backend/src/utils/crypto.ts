/*crypto.ts*/
import crypto from "crypto";

const ALGORITHM = "aes-256-gcm";
const IV_LENGTH = 12; // 96-bit IV recommended for AES-GCM
const AUTH_TAG_LENGTH = 16; // 128-bit authentication tag

/**
 * Retrieves and validates the 32-byte encryption key from environment variables.
 * Accepts either a 64-character hex string or a raw 32-character UTF-8 string.
 */
function getEncryptionKey(): Buffer {
  const secret = process.env.ENCRYPTION_KEY;

  if (!secret) {
    throw new Error("ENCRYPTION_KEY environment variable is not defined.");
  }

  let keyBuffer: Buffer;
  if (/^[0-9a-fA-F]{64}$/.test(secret)) {
    keyBuffer = Buffer.from(secret, "hex");
  } else {
    keyBuffer = Buffer.from(secret, "utf-8");
  }

  if (keyBuffer.length !== 32) {
    throw new Error(
      "ENCRYPTION_KEY must be exactly 32 bytes (or a 64-character hex string)."
    );
  }

  return keyBuffer;
}

/**
 * Encrypts plain text using AES-256-GCM.
 * Output format: `<iv_hex>:<auth_tag_hex>:<encrypted_data_hex>`
 */
export function encryptToken(text: string): string {
  if (!text) {
    throw new Error("Cannot encrypt empty token payload.");
  }

  const key = getEncryptionKey();
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });

  let encrypted = cipher.update(text, "utf8", "hex");
  encrypted += cipher.final("hex");

  const authTag = cipher.getAuthTag().toString("hex");

  return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

/**
 * Decrypts a formatted ciphertext string (`<iv_hex>:<auth_tag_hex>:<encrypted_data_hex>`).
 * Fails safely if the string or authentication tag has been tampered with.
 */
export function decryptToken(encryptedString: string): string {
  if (!encryptedString) {
    throw new Error("Cannot decrypt empty value.");
  }

  const parts = encryptedString.split(":");
  if (parts.length !== 3) {
    throw new Error("Invalid encrypted token string format.");
  }

  const [ivHex, authTagHex, encryptedHex] = parts;
  if (!ivHex || !authTagHex || !encryptedHex) {
    throw new Error("Corrupted token components.");
  }

  const key = getEncryptionKey();
  const iv = Buffer.from(ivHex, "hex");
  const authTag = Buffer.from(authTagHex, "hex");

  if (iv.length !== IV_LENGTH || authTag.length !== AUTH_TAG_LENGTH) {
    throw new Error("Invalid IV or Authentication Tag length.");
  }

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH,
  });
  decipher.setAuthTag(authTag);

  try {
    let decrypted = decipher.update(encryptedHex, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
  } catch {
    throw new Error("Decryption failed: Token payload has been modified or encryption key is invalid.");
  }
}