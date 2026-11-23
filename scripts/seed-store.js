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
  const content = fs.readFileSync('lib/seed-data.ts', 'utf8');
  const match = content.match(/export const seedStoreItems: StoreItem\[\] = (\[[\s\S]*?\]);/);
  if (!match) {
    console.error('Could not find seedStoreItems');
    return;
  }
  
  // Use Function to parse JS object literal safely
  const seedStoreItems = new Function(`return ${match[1]}`)();
  console.log(`Found ${seedStoreItems.length} store items. Upserting into Cloud PostgreSQL...`);

  for (const item of seedStoreItems) {
    await prisma.storeItem.upsert({
      where: { id: item.id },
      update: {
        title: item.title,
        category: item.category,
        price: item.price,
        image: item.image,
        badge: item.badge ?? null,
        description: item.description,
        features: JSON.stringify(item.features ?? []),
        options: item.options ? JSON.stringify(item.options) : null,
        inStock: item.inStock,
      },
      create: {
        id: item.id,
        title: item.title,
        category: item.category,
        price: item.price,
        image: item.image,
        badge: item.badge ?? null,
        description: item.description,
        features: JSON.stringify(item.features ?? []),
        options: item.options ? JSON.stringify(item.options) : null,
        inStock: item.inStock,
      },
    });
  }
  console.log('All store items seeded successfully!');
}

main()
  .catch((e) => {
    console.error('Error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
