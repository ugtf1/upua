import {
  decryptQuickBooksCredentials,
  encryptQuickBooksCredentials,
  isQuickBooksCredentials,
  type QuickBooksCredentials,
} from "./quickbooks-credentials";

type LockedConnection = {
  read(): Promise<string | null>;
  write(encrypted: string): Promise<void>;
  remove(): Promise<void>;
};

export type QuickBooksConnectionStore = {
  withLock<T>(action: (connection: LockedConnection) => Promise<T>): Promise<T>;
};

// All writers, including connect and disconnect, must use the same advisory lock.
export function postgresQuickBooksStore(prisma: any): QuickBooksConnectionStore {
  if (!prisma?.$transaction) throw new Error("QuickBooks requires a configured PostgreSQL database");
  return {
    withLock: <T>(action: (connection: LockedConnection) => Promise<T>) => prisma.$transaction(async (tx: any) => {
      // Select a boolean so the driver's result does not need to decode PostgreSQL's void type.
      await tx.$queryRaw`SELECT true AS locked FROM pg_advisory_xact_lock(1849076074, 1)`;
      return action({
        read: async () => (await tx.quickBooksConnection.findUnique({ where: { id: "primary" } }))?.encrypted ?? null,
        write: async (encrypted) => { await tx.quickBooksConnection.upsert({ where: { id: "primary" }, create: { id: "primary", encrypted }, update: { encrypted } }); },
        remove: async () => { await tx.quickBooksConnection.deleteMany({ where: { id: "primary" } }); },
      });
    }, { maxWait: 12000, timeout: 20000 }),
  };
}

export async function saveQuickBooksCredentials(store: QuickBooksConnectionStore, key: string, credentials: QuickBooksCredentials): Promise<void> {
  if (!isQuickBooksCredentials(credentials)) throw new Error("Invalid QuickBooks credentials");
  await store.withLock(async (connection) => {
    await connection.write(encryptQuickBooksCredentials(credentials, key));
  });
}

export async function deleteQuickBooksCredentials(store: QuickBooksConnectionStore): Promise<void> {
  await store.withLock(async (connection) => { await connection.remove(); });
}

type RefreshResult = { access_token: string; refresh_token: string; expires_in: number };
type Refresh = (refreshToken: string) => Promise<RefreshResult>;

/** Keeps rotated refresh tokens consistent across concurrent Cloud Run instances. */
export async function getQuickBooksAccess(
  store: QuickBooksConnectionStore,
  key: string,
  refresh: Refresh,
  now: () => number = Date.now,
): Promise<{ accessToken: string; realmId: string } | null> {
  return store.withLock(async (connection) => {
    const encrypted = await connection.read();
    if (!encrypted) return null;
    const credentials = decryptQuickBooksCredentials(encrypted, key);
    if (now() < credentials.expiresAt - 60_000) {
      return { accessToken: credentials.accessToken, realmId: credentials.realmId };
    }
    const next = await refresh(credentials.refreshToken);
    if (!next || typeof next.access_token !== "string" || !next.access_token ||
        typeof next.refresh_token !== "string" || !next.refresh_token ||
        typeof next.expires_in !== "number" || !Number.isFinite(next.expires_in) || next.expires_in <= 0) {
      throw new Error("Invalid QuickBooks token refresh response");
    }
    const updated: QuickBooksCredentials = {
      accessToken: next.access_token, refreshToken: next.refresh_token,
      realmId: credentials.realmId, expiresAt: now() + next.expires_in * 1000,
    };
    await connection.write(encryptQuickBooksCredentials(updated, key));
    return { accessToken: updated.accessToken, realmId: updated.realmId };
  });
}

/** Errors deliberately exclude the response body, which may contain sensitive data. */
export function quickBooksTokenRefresher(clientId: string, clientSecret: string, http: typeof fetch = fetch): Refresh {
  if (!clientId || !clientSecret) throw new Error("QuickBooks client credentials are not configured");
  return async (refreshToken) => {
    const response = await http("https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer", {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded", Accept: "application/json",
      },
      body: new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken }),
      signal: AbortSignal.timeout(8000),
    });
    if (!response.ok) throw new Error(`QuickBooks token refresh failed (${response.status})`);
    return await response.json() as RefreshResult;
  };
}
