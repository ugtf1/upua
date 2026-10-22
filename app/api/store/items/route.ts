import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { seedStoreItems } from "@/lib/seed-data";
import type { StoreItem } from "@/types";

// ─── Helpers to convert between DB row ↔ app type ─────────────────────────────

function dbToStoreItem(row: {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
  badge: string | null;
  description: string;
  features: string;
  options: string | null;
  inStock: boolean;
}): StoreItem {
  return {
    id: row.id,
    title: row.title,
    category: row.category as StoreItem["category"],
    price: row.price,
    image: row.image,
    badge: row.badge ?? undefined,
    description: row.description,
    features: safeParseJson<string[]>(row.features, []),
    options: row.options ? safeParseJson<string[] | undefined>(row.options, undefined) : undefined,
    inStock: row.inStock,
  };
}

function safeParseJson<T>(val: string, fallback: T): T {
  try {
    return JSON.parse(val) as T;
  } catch {
    return fallback;
  }
}

// ─── Seed DB with default items on first use ──────────────────────────────────

async function ensureSeeded() {
  if (!prisma) return false;
  const count = await prisma.storeItem.count();
  if (count === 0) {
    await prisma.storeItem.createMany({
      data: seedStoreItems.map((item) => ({
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
      })),
      skipDuplicates: true,
    });
  }
  return true;
}

// ─── GET /api/store/items ──────────────────────────────────────────────────────

export async function GET() {
  try {
    if (!prisma) throw new Error("No DB");
    await ensureSeeded();
    const rows = await prisma.storeItem.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, data: rows.map(dbToStoreItem) });
  } catch {
    // Fallback: return seed data so the store always renders
    return NextResponse.json({ success: true, data: seedStoreItems });
  }
}

// ─── POST /api/store/items ─────────────────────────────────────────────────────

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || typeof body.price !== "number" || !body.category) {
      return NextResponse.json(
        { success: false, error: "Title, valid price, and category are required." },
        { status: 400 }
      );
    }

    const features: string[] = Array.isArray(body.features)
      ? body.features.filter(Boolean)
      : typeof body.features === "string"
      ? body.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
      : [];

    const options: string[] | undefined = Array.isArray(body.options)
      ? body.options.filter(Boolean)
      : typeof body.options === "string" && body.options.trim()
      ? body.options.split(",").map((o: string) => o.trim()).filter(Boolean)
      : undefined;

    const id =
      body.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    if (!prisma) throw new Error("No DB");

    const row = await prisma.storeItem.create({
      data: {
        id,
        title: body.title.trim(),
        category: body.category,
        price: Number(body.price),
        image: body.image || "/store/convention-booth.svg",
        badge: body.badge?.trim() || null,
        description: body.description?.trim() || "",
        features: JSON.stringify(features),
        options: options ? JSON.stringify(options) : null,
        inStock: body.inStock !== false,
      },
    });

    const newItem = dbToStoreItem(row);
    const allRows = await prisma.storeItem.findMany({ orderBy: { createdAt: "desc" } });

    return NextResponse.json({
      success: true,
      message: "Store item created successfully.",
      data: newItem,
      items: allRows.map(dbToStoreItem),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create item.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ─── PUT /api/store/items ──────────────────────────────────────────────────────

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required for update." },
        { status: 400 }
      );
    }

    if (!prisma) throw new Error("No DB");

    const existing = await prisma.storeItem.findUnique({ where: { id: body.id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Store item not found." },
        { status: 404 }
      );
    }

    const features: string[] = Array.isArray(body.features)
      ? body.features.filter(Boolean)
      : typeof body.features === "string"
      ? body.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
      : safeParseJson<string[]>(existing.features, []);

    const options: string[] | null =
      body.options !== undefined
        ? Array.isArray(body.options)
          ? body.options.filter(Boolean)
          : typeof body.options === "string" && body.options.trim()
          ? body.options.split(",").map((o: string) => o.trim()).filter(Boolean)
          : null
        : existing.options
        ? safeParseJson<string[] | null>(existing.options, null)
        : null;

    const row = await prisma.storeItem.update({
      where: { id: body.id },
      data: {
        title: body.title !== undefined ? body.title.trim() : existing.title,
        category: body.category !== undefined ? body.category : existing.category,
        price: body.price !== undefined ? Number(body.price) : existing.price,
        image: body.image !== undefined ? body.image : existing.image,
        badge:
          body.badge !== undefined
            ? body.badge.trim() || null
            : existing.badge,
        description:
          body.description !== undefined
            ? body.description.trim()
            : existing.description,
        features: JSON.stringify(features),
        options: options ? JSON.stringify(options) : null,
        inStock:
          body.inStock !== undefined ? Boolean(body.inStock) : existing.inStock,
      },
    });

    const updatedItem = dbToStoreItem(row);
    const allRows = await prisma.storeItem.findMany({ orderBy: { createdAt: "desc" } });

    return NextResponse.json({
      success: true,
      message: "Store item updated successfully.",
      data: updatedItem,
      items: allRows.map(dbToStoreItem),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update item.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// ─── DELETE /api/store/items?id=... ───────────────────────────────────────────

export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required for deletion." },
        { status: 400 }
      );
    }

    if (!prisma) throw new Error("No DB");

    const existing = await prisma.storeItem.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json(
        { success: false, error: "Store item not found." },
        { status: 404 }
      );
    }

    await prisma.storeItem.delete({ where: { id } });

    const allRows = await prisma.storeItem.findMany({ orderBy: { createdAt: "desc" } });

    return NextResponse.json({
      success: true,
      message: "Store item deleted successfully.",
      data: dbToStoreItem(existing),
      items: allRows.map(dbToStoreItem),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete item.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
