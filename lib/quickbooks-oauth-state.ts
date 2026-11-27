import { createHash, randomBytes } from "node:crypto";

type OAuthStateDB = {
  quickBooksOAuthState: {
    create(args: { data: { stateHash: string; sessionHash: string; expiresAt: Date } }): Promise<unknown>;
    deleteMany(args: { where: Record<string, unknown> }): Promise<{ count: number }>;
  };
};

const hash = (value: string) => createHash("sha256").update(value).digest("hex");
const STATE_TTL_MS = 10 * 60 * 1000;

/** The caller must first verify the administrator and supply the server session ID. */
export async function createQuickBooksOAuthState(db: OAuthStateDB, sessionId: string, now = Date.now()): Promise<string> {
  if (!sessionId) throw new Error("A verified session is required");
  const state = randomBytes(32).toString("base64url");
  await db.quickBooksOAuthState.create({ data: {
    stateHash: hash(state), sessionHash: hash(sessionId), expiresAt: new Date(now + STATE_TTL_MS),
  } });
  return state;
}

/** Atomically consume state; caller must separately check administrator authorization. */
export async function consumeQuickBooksOAuthState(db: OAuthStateDB, state: string, sessionId: string, now = Date.now()): Promise<boolean> {
  if (!sessionId || !/^[A-Za-z0-9_-]{43}$/.test(state)) return false;
  const result = await db.quickBooksOAuthState.deleteMany({ where: {
    stateHash: hash(state), sessionHash: hash(sessionId), expiresAt: { gt: new Date(now) },
  } });
  return result.count === 1;
}
