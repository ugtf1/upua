/**
 * Robust CSV Importer & Validator for UPUA Admin Backend
 * Supports RFC 4180 parsing (quotes, commas, escaped quotes, multiline values, UTF-8 BOM).
 * Handles dry-run validation, error reporting, database batch imports, and sample template generation.
 */

import { DataService, ChapterData, MemberRecord, PaymentRecord, ExpenseRecord } from "./data-service";
import { prisma } from "./prisma";

export type ImportType = "members" | "payments" | "expenses" | "chapters";

export interface RowError {
  row: number;
  field?: string;
  message: string;
  data?: Record<string, string>;
}

export interface ImportResult {
  success: boolean;
  type: ImportType;
  dryRun: boolean;
  totalRows: number;
  validCount: number;
  errorCount: number;
  errors: RowError[];
  importedCount: number;
  preview?: Record<string, unknown>[];
  message: string;
}

/**
 * Parses raw CSV string into an array of key-value row objects.
 * Accurately handles quoted fields containing commas, line breaks, and escaped quotes ("").
 */
export function parseCSV(rawCsv: string): { headers: string[]; rows: Record<string, string>[] } {
  // Strip UTF-8 Byte Order Mark (BOM) if present
  let text = rawCsv.replace(/^\uFEFF/, "").trim();
  if (!text) return { headers: [], rows: [] };

  const lines: string[][] = [];
  let currentRow: string[] = [];
  let currentField = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i + 1];

    if (char === '"') {
      if (insideQuotes && nextChar === '"') {
        // Escaped quote: "" -> "
        currentField += '"';
        i++;
      } else {
        // Toggle quotation mode
        insideQuotes = !insideQuotes;
      }
    } else if (char === "," && !insideQuotes) {
      currentRow.push(currentField.trim());
      currentField = "";
    } else if ((char === "\r" || char === "\n") && !insideQuotes) {
      if (char === "\r" && nextChar === "\n") {
        i++;
      }
      currentRow.push(currentField.trim());
      // Avoid pushing empty lines
      if (currentRow.some((val) => val !== "")) {
        lines.push(currentRow);
      }
      currentRow = [];
      currentField = "";
    } else {
      currentField += char;
    }
  }

  // Push remaining field & row
  if (currentField !== "" || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some((val) => val !== "")) {
      lines.push(currentRow);
    }
  }

  if (lines.length === 0) return { headers: [], rows: [] };

  // Normalize header keys: lowercase, alphanumeric and underscores
  const rawHeaders = lines[0];
  const headers = rawHeaders.map((h) =>
    h
      .toLowerCase()
      .trim()
      .replace(/[\s\-_]+/g, "_")
      .replace(/[^a-z0-9_]/g, "")
  );

  const rows: Record<string, string>[] = [];
  for (let r = 1; r < lines.length; r++) {
    const line = lines[r];
    const rowObj: Record<string, string> = {};
    headers.forEach((header, colIdx) => {
      if (header) {
        rowObj[header] = line[colIdx] !== undefined ? line[colIdx].trim() : "";
      }
    });
    rows.push(rowObj);
  }

  return { headers, rows };
}

// -------------------------------------------------------------
// Validation & Processing Handlers
// -------------------------------------------------------------

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeDate(val: string): string {
  if (!val) return new Date().toISOString().split("T")[0];
  const parsed = new Date(val);
  if (isNaN(parsed.getTime())) {
    return new Date().toISOString().split("T")[0];
  }
  return parsed.toISOString().split("T")[0];
}

export async function processMembersImport(
  rows: Record<string, string>[],
  dryRun: boolean
): Promise<ImportResult> {
  const errors: RowError[] = [];
  const validRecords: Omit<MemberRecord, "id">[] = [];
  const chapters = DataService.getChapters();

  rows.forEach((row, idx) => {
    const rowNum = idx + 2; // +1 for 0-index, +1 for header row
    const name = row.name || row.member_name || row.fullname;
    const email = row.email || row.member_email || row.contact_email;
    const phone = row.phone || row.telephone || row.mobile || "";
    const chapterIdInput = row.chapter_id || row.chapter || row.chapter_code;
    const chapterNameInput = row.chapter_name || row.chapter || "";
    const status = (row.status || "Active").trim();
    const duesStatus = (row.dues_status || row.dues || "Paid").trim();
    const role = row.role || "Member";
    const joinedDate = normalizeDate(row.joined_date || row.joined || row.date);

    if (!name) {
      errors.push({ row: rowNum, field: "name", message: "Member name is required", data: row });
      return;
    }

    if (!email || !validateEmail(email)) {
      errors.push({ row: rowNum, field: "email", message: `Valid email is required (got: '${email}')`, data: row });
      return;
    }

    // Match chapter by ID, code, or name
    let matchedChapter = chapters.find(
      (c) =>
        (chapterIdInput && (c.id.toLowerCase() === chapterIdInput.toLowerCase() || c.code.toLowerCase() === chapterIdInput.toLowerCase())) ||
        (chapterNameInput && c.name.toLowerCase().includes(chapterNameInput.toLowerCase()))
    );

    if (!matchedChapter) {
      matchedChapter = chapters[0]; // Fallback to first chapter
    }

    validRecords.push({
      name,
      email,
      phone,
      chapterId: matchedChapter.id,
      chapterName: matchedChapter.name,
      status: ["Active", "Pending", "Lapsed"].includes(status) ? (status as any) : "Active",
      duesStatus: ["Paid", "Outstanding", "Exempt"].includes(duesStatus) ? (duesStatus as any) : "Paid",
      role,
      joinedDate,
    });
  });

  let importedCount = 0;
  if (!dryRun) {
    for (const rec of validRecords) {
      DataService.addMember(rec);
      // If Postgres Prisma is active, persist directly
      try {
        if (prisma) {
          await prisma.member.upsert({
            where: { email: rec.email },
            update: {
              name: rec.name,
              phone: rec.phone,
              chapterId: rec.chapterId,
              status: rec.status,
              duesStatus: rec.duesStatus,
              role: rec.role,
              joinedDate: rec.joinedDate,
            },
            create: {
              name: rec.name,
              email: rec.email,
              phone: rec.phone,
              chapterId: rec.chapterId,
              status: rec.status,
              duesStatus: rec.duesStatus,
              role: rec.role,
              joinedDate: rec.joinedDate,
            },
          });
        }
      } catch {
        // Fallback gracefully to memory service
      }
      importedCount++;
    }
  }

  return {
    success: errors.length === 0 || validRecords.length > 0,
    type: "members",
    dryRun,
    totalRows: rows.length,
    validCount: validRecords.length,
    errorCount: errors.length,
    errors,
    importedCount,
    preview: validRecords.slice(0, 5),
    message: dryRun
      ? `Validation complete: ${validRecords.length} valid rows, ${errors.length} errors found.`
      : `Successfully imported ${importedCount} members.`,
  };
}

export async function processPaymentsImport(
  rows: Record<string, string>[],
  dryRun: boolean
): Promise<ImportResult> {
  const errors: RowError[] = [];
  const validRecords: Omit<PaymentRecord, "id">[] = [];
  const chapters = DataService.getChapters();

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    const memberName = row.member_name || row.name || row.member;
    const amountNum = parseFloat(row.amount || row.payment_amount || "0");
    const category = (row.category || row.type || "monthly_dues").toLowerCase().replace(/[\s-]/g, "_");
    const date = normalizeDate(row.date || row.payment_date);
    const description = row.description || row.desc || row.memo || `Imported ${category} payment`;
    const paymentMethod = (row.payment_method || row.method || "bank_transfer").toLowerCase() as any;
    const status = (row.status || "completed").toLowerCase() as any;
    const chapterInput = row.chapter_id || row.chapter || row.chapter_name;

    if (!memberName) {
      errors.push({ row: rowNum, field: "member_name", message: "Member/Payee name is required", data: row });
      return;
    }

    if (isNaN(amountNum) || amountNum <= 0) {
      errors.push({ row: rowNum, field: "amount", message: `Amount must be a positive number (got: '${row.amount}')`, data: row });
      return;
    }

    const validCategories = ["monthly_dues", "donation", "ticket", "merchandise"];
    const normalizedCategory = validCategories.includes(category) ? category : "monthly_dues";

    const matchedChapter = chapters.find(
      (c) =>
        (chapterInput && (c.id.toLowerCase() === chapterInput.toLowerCase() || c.code.toLowerCase() === chapterInput.toLowerCase())) ||
        (chapterInput && c.name.toLowerCase().includes(chapterInput.toLowerCase()))
    ) || chapters[0];

    validRecords.push({
      chapterId: matchedChapter.id,
      chapterName: matchedChapter.name,
      memberName,
      category: normalizedCategory as any,
      amount: amountNum,
      date,
      description,
      paymentMethod: ["stripe", "card", "bank_transfer"].includes(paymentMethod) ? paymentMethod : "bank_transfer",
      status: ["completed", "pending", "failed"].includes(status) ? status : "completed",
    });
  });

  let importedCount = 0;
  if (!dryRun) {
    for (const rec of validRecords) {
      DataService.addPayment(rec);
      try {
        if (prisma) {
          await prisma.payment.create({
            data: {
              chapterId: rec.chapterId,
              memberName: rec.memberName,
              category: rec.category,
              amount: rec.amount,
              date: rec.date,
              description: rec.description,
              paymentMethod: rec.paymentMethod,
              status: rec.status,
            },
          });
        }
      } catch {
        // Fallback
      }
      importedCount++;
    }
  }

  return {
    success: errors.length === 0 || validRecords.length > 0,
    type: "payments",
    dryRun,
    totalRows: rows.length,
    validCount: validRecords.length,
    errorCount: errors.length,
    errors,
    importedCount,
    preview: validRecords.slice(0, 5),
    message: dryRun
      ? `Validation complete: ${validRecords.length} valid payments, ${errors.length} errors found.`
      : `Successfully imported ${importedCount} payment records.`,
  };
}

export async function processExpensesImport(
  rows: Record<string, string>[],
  dryRun: boolean
): Promise<ImportResult> {
  const errors: RowError[] = [];
  const validRecords: Omit<ExpenseRecord, "id">[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    const category = row.category || row.expense_category || "Humanitarian Aid";
    const amountNum = parseFloat(row.amount || row.expense_amount || "0");
    const date = normalizeDate(row.date || row.expense_date);
    const description = row.description || row.desc || "";
    const approvedBy = row.approved_by || row.approver || "National Executive Assembly";
    const vendor = row.vendor || row.supplier || row.payee || "General Vendor";
    const status = (row.status || "Paid").trim();

    if (isNaN(amountNum) || amountNum <= 0) {
      errors.push({ row: rowNum, field: "amount", message: `Amount must be a positive number (got: '${row.amount}')`, data: row });
      return;
    }

    if (!description) {
      errors.push({ row: rowNum, field: "description", message: "Expense description is required", data: row });
      return;
    }

    validRecords.push({
      category,
      amount: amountNum,
      date,
      description,
      approvedBy,
      vendor,
      status: ["Approved", "Paid", "Pending"].includes(status) ? (status as any) : "Paid",
    });
  });

  let importedCount = 0;
  if (!dryRun) {
    for (const rec of validRecords) {
      DataService.addExpense(rec);
      try {
        if (prisma) {
          await prisma.expense.create({
            data: {
              category: rec.category,
              amount: rec.amount,
              date: rec.date,
              description: rec.description,
              approvedBy: rec.approvedBy,
              vendor: rec.vendor,
              status: rec.status,
            },
          });
        }
      } catch {
        // Fallback
      }
      importedCount++;
    }
  }

  return {
    success: errors.length === 0 || validRecords.length > 0,
    type: "expenses",
    dryRun,
    totalRows: rows.length,
    validCount: validRecords.length,
    errorCount: errors.length,
    errors,
    importedCount,
    preview: validRecords.slice(0, 5),
    message: dryRun
      ? `Validation complete: ${validRecords.length} valid expenses, ${errors.length} errors found.`
      : `Successfully imported ${importedCount} expense records.`,
  };
}

export async function processChaptersImport(
  rows: Record<string, string>[],
  dryRun: boolean
): Promise<ImportResult> {
  const errors: RowError[] = [];
  const validRecords: Omit<ChapterData, "paymentsBreakdown">[] = [];

  rows.forEach((row, idx) => {
    const rowNum = idx + 2;
    const name = row.name || row.chapter_name;
    const code = (row.code || row.chapter_code || name || "").toUpperCase().replace(/[^A-Z0-9]/g, "_");
    const region = row.region || "North America";
    const president = row.president || row.chapter_president || "Chapter President";
    const contactEmail = row.contact_email || row.email || `chapter.${code.toLowerCase()}@upuamerica.org`;
    const memberCount = parseInt(row.member_count || row.members || "0", 10);
    const website = row.website || row.url || "";
    const id = row.id || `c-${code.toLowerCase().replace(/_/g, "-")}`;

    if (!name) {
      errors.push({ row: rowNum, field: "name", message: "Chapter name is required", data: row });
      return;
    }

    validRecords.push({
      id,
      name,
      code,
      region,
      president,
      contactEmail,
      memberCount: isNaN(memberCount) ? 0 : memberCount,
      website: website || undefined,
    });
  });

  let importedCount = 0;
  if (!dryRun) {
    for (const rec of validRecords) {
      DataService.addChapter(rec);
      try {
        if (prisma) {
          await prisma.chapter.upsert({
            where: { id: rec.id },
            update: {
              name: rec.name,
              code: rec.code,
              region: rec.region,
              president: rec.president,
              contactEmail: rec.contactEmail,
              memberCount: rec.memberCount,
              website: rec.website,
            },
            create: {
              id: rec.id,
              name: rec.name,
              code: rec.code,
              region: rec.region,
              president: rec.president,
              contactEmail: rec.contactEmail,
              memberCount: rec.memberCount,
              website: rec.website,
            },
          });
        }
      } catch {
        // Fallback
      }
      importedCount++;
    }
  }

  return {
    success: errors.length === 0 || validRecords.length > 0,
    type: "chapters",
    dryRun,
    totalRows: rows.length,
    validCount: validRecords.length,
    errorCount: errors.length,
    errors,
    importedCount,
    preview: validRecords.slice(0, 5),
    message: dryRun
      ? `Validation complete: ${validRecords.length} valid chapters, ${errors.length} errors found.`
      : `Successfully imported ${importedCount} chapters.`,
  };
}

// -------------------------------------------------------------
// Sample CSV Templates Generator
// -------------------------------------------------------------

export function getCSVTemplate(type: ImportType): { filename: string; content: string } {
  switch (type) {
    case "members":
      return {
        filename: "upua_members_import_template.csv",
        content: `name,email,phone,chapter_id,status,dues_status,role,joined_date
Chief Godspower Oniovosa,g.oniovosa@upahouston.org,(713) 555-0192,c-houston,Active,Paid,Chapter President,2020-01-15
Mrs. Evelyn Obire-Egbe,evelyn.obire@upua.org,(713) 555-0144,c-houston,Active,Paid,National Director,2021-03-20
Chief Paul Otu,paul.otu@upudmv.org,(202) 555-0176,c-dmv,Active,Paid,Chapter President,2019-11-10
Oghenekevwe Ajueyitsi,kevwe.a@upuaya.org,(202) 555-0188,c-dmv,Active,Paid,Youth Wing President,2022-05-18
`,
      };

    case "payments":
      return {
        filename: "upua_payments_import_template.csv",
        content: `member_name,chapter_id,category,amount,date,description,payment_method,status
Chief Godspower Oniovosa,c-houston,monthly_dues,120.00,2024-09-18,Q3 2024 Chapter Monthly Dues,stripe,completed
Chief Paul Otu,c-dmv,donation,500.00,2024-09-15,Women in Shelter Hygiene Drive Grant,stripe,completed
Mrs. Evelyn Obire-Egbe,c-houston,donation,250.00,2024-09-14,Okuama Emergency Medical Relief Fund,bank_transfer,completed
Mr. Thomas Uwhubetine,c-georgia,ticket,350.00,2024-09-10,Annual Convention VIP Patron Table,stripe,completed
`,
      };

    case "expenses":
      return {
        filename: "upua_expenses_import_template.csv",
        content: `category,amount,date,description,approved_by,vendor,status
Humanitarian Aid,8500.00,2024-09-12,Clean water filtration and food for Okuama IDPs,Chief Samuel Ogaga (President),Delta Humanitarian Support,Paid
Medical Supplies,6200.00,2024-09-04,Antibiotics and optical test kits,Mr. Thomas Uwhubetine (BOT Chair),AfriMed Global Supplies,Paid
STEM & AI Lab,4500.00,2024-08-25,15 computer workstations and solar inverter,Dr. Abel Okuma,TechEd Delta Systems,Paid
Convention Logistics,12500.00,2024-08-15,Convention hall rental and audiovisual broadcast,Hon. Oghenetega JohnGold,Metropolitan Civic Center,Paid
`,
      };

    case "chapters":
      return {
        filename: "upua_chapters_import_template.csv",
        content: `id,name,code,region,president,contact_email,member_count,website
c-houston,Urhobo Progressive Association (UPA) Houston,HOUSTON,Texas / South,Chief Godspower Oniovosa,houston@upuamerica.org,245,https://upahouston.org/
c-dmv,UPU of DC Maryland & Virginia (UPUDMV),DMV,Mid-Atlantic,Chief Paul Otu,dmv@upuamerica.org,210,https://upudmv.org/
c-chicago,UPU Chicagoland (UPUC),CHICAGOLAND,Midwest,Dr. Bernard Rerri,chicago@upuamerica.org,160,
c-socal,UPU of Southern California (UPUSC),SOCAL,West Coast,Mr. Felix Agbabune,socal@upuamerica.org,175,
`,
      };
  }
}
