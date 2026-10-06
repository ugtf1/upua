// Prisma Client Singleton for Next.js & Google Cloud Run

function sanitizeDatabaseUrl(url: string | undefined): string | undefined {
  if (!url) return url;
  const match = url.match(/^(postgres(?:ql)?:\/\/)([^:]+):(.*)@([^@\/]+)(\/.*)$/);
  if (!match) return url;
  const [, protocol, user, pass, host, pathAndQuery] = match;
  return `${protocol}${encodeURIComponent(decodeURIComponent(user))}:${encodeURIComponent(decodeURIComponent(pass))}@${host}${pathAndQuery}`;
}

if (process.env.DATABASE_URL) {
  process.env.DATABASE_URL = sanitizeDatabaseUrl(process.env.DATABASE_URL);
}

let prismaClientInstance: any = null;

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const PrismaModule = require("@prisma/client");
  const PrismaClient = PrismaModule.PrismaClient;
  if (PrismaClient) {
    const globalForPrisma = globalThis as unknown as { prisma: any };
    prismaClientInstance =
      globalForPrisma.prisma ??
      new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prismaClientInstance;
  }
} catch {
  prismaClientInstance = null;
}

export const prisma = prismaClientInstance;
