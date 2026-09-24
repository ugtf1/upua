import { NextResponse } from "next/server";
import { DataService } from "@/lib/data-service";

export async function GET() {
  try {
    const expenses = DataService.getExpenses();
    return NextResponse.json({ success: true, data: expenses });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to fetch expenses" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { category, amount, date, description, approvedBy, vendor, status } = body;

    const parsedAmount = Number(amount);
    if (!category || isNaN(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ success: false, error: "Valid category and positive amount are required" }, { status: 400 });
    }

    const newExpense = DataService.addExpense({
      category,
      amount: parsedAmount,
      date: date || new Date().toISOString().split("T")[0],
      description: description || "Operational expense",
      approvedBy: approvedBy || "Executive Committee",
      vendor: vendor || "Authorized Contractor",
      status: status || "Approved",
    });

    return NextResponse.json({ success: true, data: newExpense }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to record expense" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: "Expense ID is required" }, { status: 400 });
    }

    const updated = DataService.updateExpense(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: "Expense record not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to update expense" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ success: false, error: "Expense ID is required" }, { status: 400 });
    }

    DataService.deleteExpense(id);
    return NextResponse.json({ success: true, message: "Expense record deleted successfully" });
  } catch (error) {
    return NextResponse.json({ success: false, error: "Failed to delete expense" }, { status: 500 });
  }
}
