import { createCipheriv, createDecipheriv, randomBytes } from "node:crypto";

/** Decrypted tokens must only be used on the server and never returned to clients. */
export interface QuickBooksCredentials {
  accessToken: string;
  refreshToken: string;
  realmId: string;
  expiresAt: number;
}

function encryptionKey(encoded: string): Buffer {
  // Canonical base64 encoding of exactly 32 random bytes, not a passphrase.
  if (!/^[A-Za-z0-9+/]{43}=$/.test(encoded)) {
    throw new Error("QuickBooks encryption key must be a base64-encoded 32-byte key");
  }
  const key = Buffer.from(encoded, "base64");
  if (key.length !== 32 || key.toString("base64") !== encoded) {
    throw new Error("Invalid QuickBooks encryption key");
  }
  return key;
}

export function encryptQuickBooksCredentials(value: QuickBooksCredentials, encodedKey: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", encryptionKey(encodedKey), iv);
  cipher.setAAD(Buffer.from("upua.quickbooks.credentials.v1"));
  const ciphertext = Buffer.concat([cipher.update(JSON.stringify(value), "utf8"), cipher.final()]);
  return ["v1", iv.toString("base64url"), cipher.getAuthTag().toString("base64url"), ciphertext.toString("base64url")].join(".");
}

export function decryptQuickBooksCredentials(encoded: string, encodedKey: string): QuickBooksCredentials {
  const parts = encoded.split(".");
  if (parts.length !== 4 || parts[0] !== "v1" || parts.slice(1).some((p) => !/^[A-Za-z0-9_-]+$/.test(p))) {
    throw new Error("Invalid encrypted QuickBooks credentials");
  }
  const iv = Buffer.from(parts[1], "base64url");
  const tag = Buffer.from(parts[2], "base64url");
  if (iv.length !== 12 || tag.length !== 16) throw new Error("Invalid encrypted QuickBooks credentials");
  const decipher = createDecipheriv("aes-256-gcm", encryptionKey(encodedKey), iv);
  decipher.setAAD(Buffer.from("upua.quickbooks.credentials.v1"));
  decipher.setAuthTag(tag);
  const plain = Buffer.concat([decipher.update(Buffer.from(parts[3], "base64url")), decipher.final()]);
  const value: unknown = JSON.parse(plain.toString("utf8"));
  if (!isQuickBooksCredentials(value)) throw new Error("Invalid stored QuickBooks credentials");
  return value;
}

export function isQuickBooksCredentials(value: unknown): value is QuickBooksCredentials {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  return typeof v.accessToken === "string" && v.accessToken.length > 0 &&
    typeof v.refreshToken === "string" && v.refreshToken.length > 0 &&
    typeof v.realmId === "string" && /^\d+$/.test(v.realmId) &&
    typeof v.expiresAt === "number" && Number.isFinite(v.expiresAt) && v.expiresAt > 0;
}
