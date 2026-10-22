import { NextResponse } from "next/server";
import { seedStoreItems } from "@/lib/seed-data";
import type { StoreItem } from "@/types";

// In-memory persistent cache across requests for the running server instance
let storeItemsMemory: StoreItem[] = [...seedStoreItems];

export async function GET() {
  return NextResponse.json({
    success: true,
    data: storeItemsMemory,
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    if (!body.title || typeof body.price !== "number" || !body.category) {
      return NextResponse.json(
        { success: false, error: "Title, valid price, and category are required." },
        { status: 400 }
      );
    }

    const newItem: StoreItem = {
      id: body.id || `item-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      title: body.title.trim(),
      category: body.category,
      price: Number(body.price),
      image: body.image || "/store/convention-booth.svg",
      badge: body.badge?.trim() || undefined,
      description: body.description?.trim() || "",
      features: Array.isArray(body.features)
        ? body.features.filter(Boolean)
        : typeof body.features === "string"
        ? body.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
        : [],
      options: Array.isArray(body.options)
        ? body.options.filter(Boolean)
        : typeof body.options === "string" && body.options.trim()
        ? body.options.split(",").map((o: string) => o.trim()).filter(Boolean)
        : undefined,
      inStock: body.inStock !== false,
    };

    storeItemsMemory.unshift(newItem);

    return NextResponse.json({
      success: true,
      message: "Store item created successfully.",
      data: newItem,
      items: storeItemsMemory,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create item.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    if (!body.id) {
      return NextResponse.json(
        { success: false, error: "Item ID is required for update." },
        { status: 400 }
      );
    }

    const index = storeItemsMemory.findIndex((item) => item.id === body.id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Store item not found." },
        { status: 404 }
      );
    }

    const updatedItem: StoreItem = {
      ...storeItemsMemory[index],
      title: body.title !== undefined ? body.title.trim() : storeItemsMemory[index].title,
      category: body.category !== undefined ? body.category : storeItemsMemory[index].category,
      price: body.price !== undefined ? Number(body.price) : storeItemsMemory[index].price,
      image: body.image !== undefined ? body.image : storeItemsMemory[index].image,
      badge: body.badge !== undefined ? (body.badge.trim() || undefined) : storeItemsMemory[index].badge,
      description: body.description !== undefined ? body.description.trim() : storeItemsMemory[index].description,
      features: Array.isArray(body.features)
        ? body.features.filter(Boolean)
        : typeof body.features === "string"
        ? body.features.split("\n").map((f: string) => f.trim()).filter(Boolean)
        : storeItemsMemory[index].features,
      options: Array.isArray(body.options)
        ? body.options.filter(Boolean)
        : typeof body.options === "string"
        ? (body.options.trim() ? body.options.split(",").map((o: string) => o.trim()).filter(Boolean) : undefined)
        : storeItemsMemory[index].options,
      inStock: body.inStock !== undefined ? Boolean(body.inStock) : storeItemsMemory[index].inStock,
    };

    storeItemsMemory[index] = updatedItem;

    return NextResponse.json({
      success: true,
      message: "Store item updated successfully.",
      data: updatedItem,
      items: storeItemsMemory,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update item.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

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

    const index = storeItemsMemory.findIndex((item) => item.id === id);
    if (index === -1) {
      return NextResponse.json(
        { success: false, error: "Store item not found." },
        { status: 404 }
      );
    }

    const [deletedItem] = storeItemsMemory.splice(index, 1);

    return NextResponse.json({
      success: true,
      message: "Store item deleted successfully.",
      data: deletedItem,
      items: storeItemsMemory,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete item.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
