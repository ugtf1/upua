import { NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function GET() {
  try {
    const overview = DataService.getGeneralOverview();
    return NextResponse.json({ success: true, data: overview });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch general overview" }, { status: 500 });
  }
}
