import { NextResponse } from "next/server";
import { getCSVTemplate, ImportType } from "@/lib/csv-importer";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = (searchParams.get("type") || "members") as ImportType;

  const validTypes: ImportType[] = ["members", "payments", "expenses", "chapters"];
  if (!validTypes.includes(type)) {
    return NextResponse.json(
      { error: `Invalid template type '${type}'. Valid types: ${validTypes.join(", ")}` },
      { status: 400 }
    );
  }

  const { filename, content } = getCSVTemplate(type);

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
