import { NextResponse } from "next/server";
import { seedMembers } from "@/lib/seed-data";

export async function GET() {
  return NextResponse.json({ members: seedMembers });
}
