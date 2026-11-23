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

const CHAPTERS = [
  { id: "c-houston", name: "Urhobo Progressive Association (UPA), Houston", code: "HOUSTON", region: "Texas / South", president: "Chief Godspower Oniovosa", contactEmail: "houston@upuamerica.org", memberCount: 245, website: "https://upahouston.org/" },
  { id: "c-dmv", name: "UPU of DC, Maryland & Virginia (UPUDMV)", code: "DMV", region: "Mid-Atlantic", president: "Chief Paul Otu", contactEmail: "dmv@upuamerica.org", memberCount: 210, website: "https://upudmv.org/" },
  { id: "c-chicago", name: "UPU Chicagoland (UPUC)", code: "CHICAGOLAND", region: "Midwest", president: "Dr. Bernard Rerri", contactEmail: "chicago@upuamerica.org", memberCount: 160 },
  { id: "c-socal", name: "UPU of Southern California (UPUSC)", code: "SOCAL", region: "West Coast", president: "Mr. Felix Agbabune", contactEmail: "socal@upuamerica.org", memberCount: 175 },
  { id: "c-georgia", name: "Urhobo Association of Georgia (UAG)", code: "GEORGIA", region: "Southeast", president: "Mr. Thomas Uwhubetine", contactEmail: "georgia@upuamerica.org", memberCount: 190 },
  { id: "c-delaware", name: "UPU Delaware Valley (PA, DE, NJ)", code: "DELAWARE_VALLEY", region: "Northeast", president: "Engr. Akpovoke Shaire", contactEmail: "delaware@upuamerica.org", memberCount: 130 },
  { id: "c-ohio", name: "UPU of Ohio", code: "OHIO", region: "Midwest", president: "Chief (Dr) Mrs. Louisa Ukochovwera", contactEmail: "ohio@upuamerica.org", memberCount: 115 },
  { id: "c-michigan", name: "UPU Michigan (UPUMI)", code: "MICHIGAN", region: "Midwest", president: "Mr. Paul Edirin Warrence", contactEmail: "michigan@upuamerica.org", memberCount: 95 },
  { id: "c-dallas", name: "UPU Dallas-Fort Worth (DFW)", code: "DALLAS", region: "Texas / South", president: "Chief Augustine Agbaisi", contactEmail: "dallas@upuamerica.org", memberCount: 140 },
  { id: "c-newyork", name: "UPU New York Metro Chapter", code: "NEWYORK", region: "Northeast", president: "Dr. Ochuko Emoefe", contactEmail: "newyork@upuamerica.org", memberCount: 180 },
  { id: "c-florida", name: "UPU Central & South Florida", code: "FLORIDA", region: "Southeast", president: "Chief Mrs. Vivian Ikporo", contactEmail: "florida@upuamerica.org", memberCount: 125 },
  { id: "c-norcal", name: "UPU Northern California / Bay Area", code: "NORCAL", region: "West Coast", president: "Mr. Onome Kpedekpo", contactEmail: "norcal@upuamerica.org", memberCount: 110 },
  { id: "c-minnesota", name: "UPU Minnesota (Twin Cities)", code: "MINNESOTA", region: "Midwest", president: "Dr. Oghenevwede Edevbie", contactEmail: "minnesota@upuamerica.org", memberCount: 85 },
  { id: "c-arizona", name: "UPU Arizona Valley Chapter", code: "ARIZONA", region: "Southwest", president: "Mr. Ese Akpofure", contactEmail: "arizona@upuamerica.org", memberCount: 70 },
  { id: "c-carolinas", name: "UPU of the Carolinas (NC & SC)", code: "CAROLINAS", region: "Southeast", president: "Engr. Victor Ohwonigho", contactEmail: "carolinas@upuamerica.org", memberCount: 90 },
  { id: "c-colorado", name: "UPU Rocky Mountain / Colorado", code: "COLORADO", region: "Mountain", president: "Mr. Ochuko Okorodudu", contactEmail: "colorado@upuamerica.org", memberCount: 65 },
  { id: "c-massachusetts", name: "UPU New England / Massachusetts", code: "MASSACHUSETTS", region: "Northeast", president: "Dr. Kevwe Agbroko", contactEmail: "boston@upuamerica.org", memberCount: 80 },
  { id: "c-canada-toronto", name: "UPU Greater Toronto Chapter (Canada)", code: "TORONTO", region: "Canada", president: "Chief Anthony Okpako", contactEmail: "toronto@upuamerica.org", memberCount: 145 },
  { id: "c-canada-calgary", name: "UPU Western Canada / Calgary", code: "CALGARY", region: "Canada", president: "Mr. Dennis Erhirhie", contactEmail: "calgary@upuamerica.org", memberCount: 95 },
  { id: "c-kansas", name: "UPU Heartland (Kansas / Missouri)", code: "KANSAS", region: "Midwest", president: "Mr. Gabriel Efeurhobo", contactEmail: "kansas@upuamerica.org", memberCount: 60 },
  { id: "c-tennessee", name: "UPU Tennessee & Mid-South", code: "TENNESSEE", region: "Southeast", president: "Mr. Akpos Odjegba", contactEmail: "tennessee@upuamerica.org", memberCount: 55 },
  { id: "c-nevada", name: "UPU Silver State / Las Vegas", code: "NEVADA", region: "Southwest", president: "Mr. Ovie Obahor", contactEmail: "nevada@upuamerica.org", memberCount: 45 },
  { id: "c-washington", name: "UPU Pacific Northwest / Seattle", code: "WASHINGTON", region: "Pacific Northwest", president: "Engr. Tejiri Onokpise", contactEmail: "seattle@upuamerica.org", memberCount: 75 },
];

const MEMBERS = [
  { id: "m-1", chapterId: "c-houston", name: "Chief Godspower Oniovosa", email: "g.oniovosa@upahouston.org", phone: "(713) 555-0192", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2008-04-12" },
  { id: "m-2", chapterId: "c-houston", name: "Mrs. Evelyn Obire-Egbe", email: "evelyn.obire@upua.org", phone: "(713) 555-0144", status: "Active", duesStatus: "Paid", role: "National Director", joinedDate: "2012-06-20" },
  { id: "m-3", chapterId: "c-dmv", name: "Chief Paul Otu", email: "paul.otu@upudmv.org", phone: "(202) 555-0176", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2006-11-15" },
  { id: "m-4", chapterId: "c-dmv", name: "Oghenekevwe Ajueyitsi", email: "kevwe.a@upuaya.org", phone: "(202) 555-0188", status: "Active", duesStatus: "Paid", role: "Youth Wing President", joinedDate: "2021-02-10" },
  { id: "m-5", chapterId: "c-georgia", name: "Mr. Thomas Uwhubetine", email: "t.uwhubetine@upuamerica.org", phone: "(404) 555-0133", status: "Active", duesStatus: "Paid", role: "BOT Chairman", joinedDate: "2003-12-05" },
  { id: "m-6", chapterId: "c-chicago", name: "Dr. Bernard Rerri", email: "b.rerri@upuc.org", phone: "(312) 555-0155", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2010-09-14" },
  { id: "m-7", chapterId: "c-socal", name: "Mr. Felix Agbabune", email: "felix.a@upusocal.org", phone: "(213) 555-0122", status: "Active", duesStatus: "Paid", role: "Chapter President", joinedDate: "2014-03-18" },
  { id: "m-8", chapterId: "c-ohio", name: "Chief (Dr) Mrs. Louisa Ukochovwera", email: "louisa.u@upuohio.org", phone: "(614) 555-0167", status: "Active", duesStatus: "Paid", role: "Deputy BOT Chair", joinedDate: "2009-08-25" },
];

const USERS = [
  { email: "admin@upua.org", name: "National Administrator", role: "admin", title: "National Executive Administrator", phone: "+1 (800) 555-UPUA" },
  { email: "president@upua.org", name: "Chief Samuel Ogaga", role: "admin", title: "National President", phone: "+1 (404) 555-0100" },
  { email: "treasurer@upua.org", name: "Mr. Efe Shemi", role: "admin", title: "National Treasurer", phone: "+1 (713) 555-0150" },
  { email: "secretary@upua.org", name: "Chief Godwin Ikporo", role: "admin", title: "Secretary-General", phone: "+1 (202) 555-0120" },
  { email: "youth@upua.org", name: "Oghenekevwe Ajueyitsi", role: "chapter", title: "UPUAYA President", phone: "+1 (202) 555-0188" },
];

const MEETINGS = [
  {
    id: "mtg-301",
    title: "UPUA National Board of Trustees Q3 2024 Executive Assembly",
    date: "2024-09-15",
    chapterId: null,
    duration: "1h 42m",
    recordedBy: "Chief Godwin Ikporo (Secretary-General)",
    transcript: "President Chief Samuel Ogaga called the meeting to order at 2:00 PM EST with prayer and the Urhobo National Anthem. Chairman Thomas Uwhubetine outlined the strategic plan for transitioning UPUA into a permanent headquarters model. Discussion shifted to the Women in Shelter initiative report presented by Chief Mrs. Vivian Ikporo, highlighting participation across 16 chapters. The treasurer, Mr. Efe Shemi, delivered the Q3 financial report confirming total revenues of $426,850 with an operating surplus. On homeland affairs, the Board ratified an additional emergency grant of $15,000 for Okuama IDP rehabilitation. Next annual convention hosting proposals from Houston and Atlanta were tabled for committee review.",
    summary: "The Board ratified the 21st-century organizational roadmap, endorsed the nationwide Women in Shelter program expansion, approved financial audit statements, and appropriated $15,000 in emergency aid for Okuama IDP families.",
    keyDecisions: JSON.stringify([
      "Approved $15,000 supplemental humanitarian appropriation for Okuama community rehabilitation",
      "Adopted the permanent national secretariat acquisition committee framework",
      "Mandated all 23 accredited chapters to conduct their annual financial reconciliations by November 30",
    ]),
    actionItems: JSON.stringify([
      { task: "Transmit emergency relief funds to on-ground monitors in Delta State", owner: "Chief Godwin Ikporo", deadline: "2024-09-22" },
      { task: "Prepare site inspection report for potential permanent headquarters locations", owner: "Mr. Thomas Uwhubetine", deadline: "2024-10-15" },
      { task: "Distribute audited Q3 financial ledgers to all chapter presidents", owner: "Mr. Efe Shemi", deadline: "2024-09-30" },
    ]),
  },
  {
    id: "mtg-302",
    title: "Houston Chapter General Assembly & Annual Gala Planning",
    date: "2024-09-08",
    chapterId: "c-houston",
    duration: "58m",
    recordedBy: "Chief Godspower Oniovosa",
    transcript: "Meeting convened at the UPA Community Center. President Oniovosa commended members on achieving 89% annual dues compliance. Committee chairs presented plans for the upcoming Urhobo Day Cultural Festival and fundraising gala. Discussion touched on local food bank drives and the recruitment of second-generation youth members into UPUAYA.",
    summary: "Reviewed high dues collection rate, finalized logistics for the October cultural banquet, and established a youth outreach taskforce.",
    keyDecisions: JSON.stringify([
      "Set gala patron ticket prices at $100 and VIP tables at $1,000",
      "Assigned youth scholarship coordination to the educational committee",
    ]),
    actionItems: JSON.stringify([
      { task: "Finalize hall deposit and vendor agreements for banquet", owner: "Secretary, Houston Exco", deadline: "2024-09-25" },
    ]),
  },
];

const EXPENSES = [
  { id: "exp-201", category: "Humanitarian Aid", amount: 15000, date: "2024-09-18", description: "Emergency nutritional supplies, bedding, and medical kits delivered to Okuama IDP temporary rehabilitation settlement", approvedBy: "National Board of Trustees", vendor: "Red Cross Delta State Liaison & Local Logistics", status: "Paid" },
  { id: "exp-202", category: "Medical Supplies", amount: 28400, date: "2024-08-30", description: "Pharmaceutical supplies, vision testing optics, and hypertension medications for 2024 Annual Medical Outreach across 6 Urhobo local government areas", approvedBy: "National Executive Committee", vendor: "Apex Healthcare Supplies International", status: "Paid" },
  { id: "exp-203", category: "STEM & AI Lab", amount: 18250, date: "2024-08-14", description: "Procurement of 25 programmable micro-controllers, high-spec laptops, and cloud software licenses for Delta State Youth AI Bootcamp", approvedBy: "UPUAYA National Executive Council", vendor: "Silicon Valley Tech Initiative / Hardware Group", status: "Paid" },
  { id: "exp-204", category: "Convention Logistics", amount: 12000, date: "2024-07-25", description: "Initial venue deposit and audiovisual tech contract for 33rd Annual UPUA Convention in Lawrenceburg, Indiana", approvedBy: "Convention Planning Committee", vendor: "DoubleTree by Hilton Conference Services", status: "Paid" },
  { id: "exp-205", category: "Administrative", amount: 4800, date: "2024-07-02", description: "Annual corporate compliance, legal franchise renewals, and cloud hosting architecture costs", approvedBy: "Secretary-General", vendor: "Cloud Infrastructure & Legal Counsel LLC", status: "Paid" },
  { id: "exp-206", category: "Youth Programs", amount: 7500, date: "2024-06-15", description: "North America college tuition scholarships awarded to 5 deserving undergraduate students of Urhobo heritage", approvedBy: "Scholarship Review Board", vendor: "Direct Educational Institution Wire Disbursal", status: "Paid" },
];

async function seed() {
  console.log('Seeding cloud PostgreSQL database (136.108.48.146:5432/upua_db)...');

  // 1. Chapters
  console.log(`Upserting ${CHAPTERS.length} chapters...`);
  for (const c of CHAPTERS) {
    await prisma.chapter.upsert({
      where: { id: c.id },
      update: c,
      create: c,
    });
  }
  console.log('Chapters seeded successfully.');

  // 2. Members
  console.log(`Upserting ${MEMBERS.length} members...`);
  for (const m of MEMBERS) {
    await prisma.member.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log('Members seeded successfully.');

  // 3. Users
  console.log(`Upserting ${USERS.length} users...`);
  for (const u of USERS) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: u,
      create: u,
    });
  }
  console.log('Users seeded successfully.');

  // 4. Meetings
  console.log(`Upserting ${MEETINGS.length} meetings...`);
  for (const m of MEETINGS) {
    await prisma.meeting.upsert({
      where: { id: m.id },
      update: m,
      create: m,
    });
  }
  console.log('Meetings seeded successfully.');

  // 5. Expenses
  console.log(`Upserting ${EXPENSES.length} expenses...`);
  for (const e of EXPENSES) {
    await prisma.expense.upsert({
      where: { id: e.id },
      update: e,
      create: e,
    });
  }
  console.log('Expenses seeded successfully.');

  console.log('All tables successfully seeded!');
}

seed()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
