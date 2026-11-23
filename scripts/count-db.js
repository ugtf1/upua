const fs = require('fs');
const { PrismaClient } = require('@prisma/client');

if (!process.env.DATABASE_URL && fs.existsSync('.env')) {
  const envContent = fs.readFileSync('.env', 'utf8');
  for (const line of envContent.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const idx = trimmed.indexOf('=');
      if (idx !== -1) {
        const key = trimmed.slice(0, idx).trim();
        const val = trimmed.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
        if (!process.env[key]) process.env[key] = val;
      }
    }
  }
}

const prisma = new PrismaClient();

async function main() {
  const [chapters, members, users, meetings, expenses, storeItems] = await Promise.all([
    prisma.chapter.count(),
    prisma.member.count(),
    prisma.user.count(),
    prisma.meeting.count(),
    prisma.expense.count(),
    prisma.storeItem.count(),
  ]);

  console.log('--- UPUA Cloud PostgreSQL Database Counts ---');
  console.log('Chapters:', chapters);
  console.log('Members:', members);
  console.log('Users:', users);
  console.log('Meetings:', meetings);
  console.log('Expenses:', expenses);
  console.log('StoreItems:', storeItems);
}

main().finally(() => prisma.$disconnect());
