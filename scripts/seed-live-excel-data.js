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

// Load live data from lib/excel-live-data.ts
// We'll read the exported arrays
async function main() {
  console.log('=== UPUA Cloud Database Live Excel Migration ===');
  console.log('Step 1: Connecting to PostgreSQL database...');

  // Require compiled or TypeScript module or import directly
  // We can require typescript or ts-node or parse
  const { LIVE_CHAPTERS, getParsedQBTransactions } = require('./lib/excel-live-data');
  const qbTransactions = getParsedQBTransactions();

  console.log(`Loaded ${LIVE_CHAPTERS.length} chapters and ${qbTransactions.length} QB transactions.`);

  console.log('Step 2: Removing all pre-seeded placeholder data...');
  const delPayments = await prisma.payment.deleteMany({});
  console.log(`Deleted ${delPayments.count} old payments.`);

  const delMembers = await prisma.member.deleteMany({});
  console.log(`Deleted ${delMembers.count} old members.`);

  const delChapters = await prisma.chapter.deleteMany({});
  console.log(`Deleted ${delChapters.count} old chapters.`);

  console.log('Step 3: Seeding 24 Live Chapters with multi-year audit numbers...');
  for (const ch of LIVE_CHAPTERS) {
    await prisma.chapter.create({
      data: {
        id: ch.id,
        name: ch.name,
        code: ch.code,
        region: ch.region,
        president: ch.president,
        contactPhone: ch.contactPhone,
        contactEmail: ch.contactEmail,
        memberCount: Math.round(ch.memberCount),
        website: ch.website || null,

        // Multi-year metrics
        members2023: ch.members2023,
        dues2023Exp: ch.dues2023Exp,
        dues2023Paid: ch.dues2023Paid,

        members2024: ch.members2024,
        dues2024Exp: ch.dues2024Exp,
        dues2024Paid: ch.dues2024Paid,

        members2025: ch.members2025,
        dues2025Exp: ch.dues2025Exp,
        dues2025Paid: ch.dues2025Paid,

        members2026: ch.members2026,
        dues2026Exp: ch.dues2026Exp,
        dues2026Paid: ch.dues2026Paid,

        duesBalance: ch.duesBalance,

        insurance2023Paid: ch.insurance2023Paid,
        insurance2024Paid: ch.insurance2024Paid,
        insurance2025Paid: ch.insurance2025Paid,
        insuranceTotal: ch.insuranceTotal,
        insuranceColonial: ch.insuranceColonial,

        raffleStatus: ch.raffleStatus,
        raffleSent: ch.raffleSent,
        rafflePaid: ch.rafflePaid,
        raffleBalance: ch.raffleBalance,
      },
    });

    // Create a real leadership member for this chapter
    const cleanPresName = ch.president.replace(/\s*\(President\)/i, '').trim();
    await prisma.member.create({
      data: {
        id: `m-${ch.id}`,
        chapterId: ch.id,
        name: cleanPresName,
        email: ch.contactEmail,
        phone: ch.contactPhone,
        role: "Chapter President",
        status: "Active",
        duesStatus: ch.duesBalance >= 0 ? "Paid" : "Outstanding",
        joinedDate: "2023-01-01",
      },
    });
  }
  console.log(`Successfully created ${LIVE_CHAPTERS.length} chapters & president member records.`);

  console.log('Step 4: Seeding 84 Live QuickBooks Received Payment Transactions...');
  let totalDuesAmount = 0;
  for (const tx of qbTransactions) {
    totalDuesAmount += tx.amount;
    await prisma.payment.create({
      data: {
        id: tx.id,
        chapterId: tx.chapterId,
        memberName: tx.customer,
        category: tx.category,
        amount: tx.amount,
        date: tx.date,
        description: tx.description,
        paymentMethod: tx.paymentMethod,
        confirmationNo: tx.confirmationNo || null,
        status: "completed",
      },
    });
  }
  console.log(`Successfully recorded ${qbTransactions.length} QB transactions.`);
  console.log(`Total QB Dues Received Sum: $${totalDuesAmount.toFixed(2)}`);

  console.log('\n--- Final Cloud Database Counts ---');
  const [chapCount, memCount, payCount] = await Promise.all([
    prisma.chapter.count(),
    prisma.member.count(),
    prisma.payment.count(),
  ]);
  console.log(`Chapters: ${chapCount}`);
  console.log(`Members:  ${memCount}`);
  console.log(`Payments: ${payCount}`);
  console.log('=== Migration Complete! ===');
}

main()
  .catch((e) => {
    console.error('Migration failed:', e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
