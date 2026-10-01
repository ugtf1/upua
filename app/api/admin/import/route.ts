import { NextResponse } from "next/server";
import {
  parseCSV,
  processMembersImport,
  processPaymentsImport,
  processExpensesImport,
  processChaptersImport,
  ImportType,
  ImportResult,
} from "@/lib/csv-importer";

export async function POST(request: Request) {
  try {
    let csvText = "";
    let type: ImportType = "members";
    let dryRun = false;

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("multipart/form-data")) {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;
      type = (formData.get("type") as ImportType) || "members";
      dryRun = formData.get("dryRun") === "true";

      if (!file) {
        return NextResponse.json(
          { success: false, error: "No CSV file provided in form-data" },
          { status: 400 }
        );
      }
      csvText = await file.text();
    } else {
      const body = await request.json();
      csvText = body.csvText || body.csv || "";
      type = (body.type as ImportType) || "members";
      dryRun = Boolean(body.dryRun);
    }

    if (!csvText || !csvText.trim()) {
      return NextResponse.json(
        { success: false, error: "CSV data is empty" },
        { status: 400 }
      );
    }

    const validTypes: ImportType[] = ["members", "payments", "expenses", "chapters"];
    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { success: false, error: `Invalid import type '${type}'. Must be one of: ${validTypes.join(", ")}` },
        { status: 400 }
      );
    }

    // Parse CSV
    const { headers, rows } = parseCSV(csvText);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: "No valid data rows found in CSV (make sure first line is headers)" },
        { status: 400 }
      );
    }

    let result: ImportResult;

    switch (type) {
      case "members":
        result = await processMembersImport(rows, dryRun);
        break;
      case "payments":
        result = await processPaymentsImport(rows, dryRun);
        break;
      case "expenses":
        result = await processExpensesImport(rows, dryRun);
        break;
      case "chapters":
        result = await processChaptersImport(rows, dryRun);
        break;
    }

    return NextResponse.json({
      ...result,
      detectedHeaders: headers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to process CSV import" },
      { status: 500 }
    );
  }
}
