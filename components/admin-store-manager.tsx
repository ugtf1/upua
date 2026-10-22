"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Pencil,
  Trash2,
  CheckCircle2,
  AlertCircle,
  X,
  Search,
  DollarSign,
  Layers,
  Sparkles,
  ExternalLink,
  ChevronDown,
  LayoutGrid,
  List
} from "lucide-react";
import type { StoreItem, StoreCategory } from "@/types";

const CATEGORIES: StoreCategory[] = [
  "Convention Packages",
  "Apparel & Regalia",
  "Books & Culture",
  "Accessories",
];

const PRESET_GRAPHICS = [
  { label: "Convention Booth / Table", value: "/store/convention-booth.svg" },
  { label: "Full-Page Souvenir Brochure", value: "/store/brochure-full-page.svg" },
  { label: "Half-Page Souvenir Brochure", value: "/store/brochure-half-page.svg" },
  { label: "Gala Banquet Ticket Pass", value: "/store/gala-ticket.svg" },
  { label: "Ceremonial Sash & Beads", value: "/store/regalia-sash-coral.svg" },
  { label: "Heritage Crest Polo Shirt", value: "/store/apparel-polo.svg" },
  { label: "Urhobo Dictionary Book", value: "/store/book-dictionary.svg" },
  { label: "Commemorative Lapel Pins", value: "/store/accessory-lapel-pin.svg" },
  { label: "Ceremonial Desk Banner", value: "/store/accessory-desk-flag.svg" },
  { label: "UPUAYA Fleece Hoodie", value: "/store/apparel-hoodie.svg" },
  { label: "Official UPUA Seal / Logo", value: "/upua-logo.png" },
];

interface AdminStoreManagerProps {
  items: StoreItem[];
  setItems: (items: StoreItem[] | ((prev: StoreItem[]) => StoreItem[])) => void;
}

export default function AdminStoreManager({ items, setItems }: AdminStoreManagerProps) {
  const [filterCategory, setFilterCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [modalMode, setModalMode] = useState<"create" | "edit" | null>(null);
  const [activeItem, setActiveItem] = useState<StoreItem | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<StoreItem | null>(null);
  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [viewMode, setViewMode] = useState<"grid" | "table">("grid");

  // Form Fields
  const [formTitle, setFormTitle] = useState("");
  const [formCategory, setFormCategory] = useState<StoreCategory>("Convention Packages");
  const [formPrice, setFormPrice] = useState("");
  const [formImage, setFormImage] = useState("/store/convention-booth.svg");
  const [formBadge, setFormBadge] = useState("");
  const [formDescription, setFormDescription] = useState("");
  const [formFeatures, setFormFeatures] = useState("");
  const [formOptions, setFormOptions] = useState("");
  const [formInStock, setFormInStock] = useState(true);

  const showNotification = (type: "success" | "error", message: string) => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4500);
  };

  const openCreateModal = () => {
    setFormTitle("");
    setFormCategory("Convention Packages");
    setFormPrice("");
    setFormImage("/store/convention-booth.svg");
    setFormBadge("");
    setFormDescription("");
    setFormFeatures("");
    setFormOptions("");
    setFormInStock(true);
    setActiveItem(null);
    setModalMode("create");
  };

  const openEditModal = (item: StoreItem) => {
    setActiveItem(item);
    setFormTitle(item.title);
    setFormCategory(item.category);
    setFormPrice(item.price.toString());
    setFormImage(item.image);
    setFormBadge(item.badge || "");
    setFormDescription(item.description);
    setFormFeatures(item.features ? item.features.join("\n") : "");
    setFormOptions(item.options ? item.options.join(", ") : "");
    setFormInStock(item.inStock);
    setModalMode("edit");
  };

  const handleSaveItem = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formTitle.trim()) {
      showNotification("error", "Please provide a valid item title.");
      return;
    }
    const parsedPrice = parseFloat(formPrice);
    if (isNaN(parsedPrice) || parsedPrice < 0) {
      showNotification("error", "Please enter a valid price ($0 or greater).");
      return;
    }

    const itemData: StoreItem = {
      id: modalMode === "edit" && activeItem ? activeItem.id : `item-${Date.now()}`,
      title: formTitle.trim(),
      category: formCategory,
      price: parsedPrice,
      image: formImage,
      badge: formBadge.trim() || undefined,
      description: formDescription.trim(),
      features: formFeatures
        .split("\n")
        .map((f) => f.trim())
        .filter(Boolean),
      options: formOptions.trim()
        ? formOptions.split(",").map((o) => o.trim()).filter(Boolean)
        : undefined,
      inStock: formInStock,
    };

    try {
      // Sync with API route
      const method = modalMode === "create" ? "POST" : "PUT";
      fetch("/api/store/items", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(itemData),
      }).catch((err) => console.warn("API sync fallback to local storage:", err));

      if (modalMode === "create") {
        setItems((prev) => [itemData, ...prev]);
        showNotification("success", `Item "${itemData.title}" was added to the store catalog.`);
      } else {
        setItems((prev) => prev.map((item) => (item.id === itemData.id ? itemData : item)));
        showNotification("success", `Item "${itemData.title}" was updated successfully.`);
      }
      setModalMode(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error saving store item.";
      showNotification("error", msg);
    }
  };

  const confirmDeleteItem = async () => {
    if (!deleteCandidate) return;

    try {
      fetch(`/api/store/items?id=${encodeURIComponent(deleteCandidate.id)}`, {
        method: "DELETE",
      }).catch((err) => console.warn("API delete fallback to local storage:", err));

      setItems((prev) => prev.filter((item) => item.id !== deleteCandidate.id));
      showNotification("success", `Item "${deleteCandidate.title}" has been deleted.`);
      setDeleteCandidate(null);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error deleting store item.";
      showNotification("error", msg);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesCat = filterCategory === "All" || item.category === filterCategory;
    const matchesQuery =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesQuery;
  });

  return (
    <div className="store-admin-wrap">
      {/* Top Banner / Notification */}
      {notification && (
        <div
          className={`store-admin-alert ${
            notification.type === "success" ? "alert-success" : "alert-error"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 size={18} />
          ) : (
            <AlertCircle size={18} />
          )}
          <span>{notification.message}</span>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setNotification(null)}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* Header bar */}
      <div className="store-admin-header">
        <div>
          <div className="store-admin-pill">
            <Sparkles size={14} />
            <span>Store &amp; Merchandise Management</span>
          </div>
          <h2 className="store-admin-title">Store Catalog Manager</h2>
          <p className="store-admin-subtitle">
            Administer public store packages, convention booths, apparel, regalia, and tickets without portal access barriers for buyers.
          </p>
        </div>
        <div className="store-admin-actions">
          <a
            href="/store"
            target="_blank"
            rel="noopener noreferrer"
            className="store-admin-view-store-btn"
          >
            <ExternalLink size={16} />
            <span>Open Public Storefront</span>
          </a>
          <button
            type="button"
            onClick={openCreateModal}
            className="store-admin-add-btn"
          >
            <Plus size={18} />
            <span>Add New Item</span>
          </button>
        </div>
      </div>

      {/* Quick Metrics Bar */}
      <div className="store-admin-metrics-grid">
        <div className="store-admin-metric-card">
          <div className="metric-icon-wrap" style={{ background: "#e8f5ed", color: "#0b3323" }}>
            <Package size={22} />
          </div>
          <div>
            <div className="metric-label">Total Store Items</div>
            <div className="metric-value">{items.length}</div>
          </div>
        </div>

        <div className="store-admin-metric-card">
          <div className="metric-icon-wrap" style={{ background: "#fef9c3", color: "#854d0e" }}>
            <CheckCircle2 size={22} />
          </div>
          <div>
            <div className="metric-label">Active / In Stock</div>
            <div className="metric-value">{items.filter((i) => i.inStock).length}</div>
          </div>
        </div>

        <div className="store-admin-metric-card">
          <div className="metric-icon-wrap" style={{ background: "#fee2e2", color: "#991b1b" }}>
            <Layers size={22} />
          </div>
          <div>
            <div className="metric-label">Categories Configured</div>
            <div className="metric-value">{CATEGORIES.length}</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="store-admin-toolbar">
        <div className="store-admin-tabs">
          {["All", ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              type="button"
              className={`store-tab-btn ${filterCategory === cat ? "active" : ""}`}
              onClick={() => setFilterCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="store-admin-search-wrap">
          <Search size={16} color="#6b7280" />
          <input
            type="text"
            className="store-admin-search-input"
            placeholder="Search items by title or keywords..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* View Mode Switcher */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={`store-tab-btn ${viewMode === "grid" ? "active" : ""}`}
            style={{ padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            title="Card Grid View (with Edit & Delete Icons)"
          >
            <LayoutGrid size={16} />
            <span>Cards</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode("table")}
            className={`store-tab-btn ${viewMode === "table" ? "active" : ""}`}
            style={{ padding: "8px 12px", display: "inline-flex", alignItems: "center", gap: "6px", cursor: "pointer" }}
            title="Data Table View"
          >
            <List size={16} />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Catalog Display */}
      {filteredItems.length === 0 ? (
        <div className="store-admin-table-card">
          <div className="store-admin-empty">
            <Package size={48} strokeWidth={1.5} color="#9ca3af" />
            <h3>No store items match your criteria</h3>
            <p>Try adjusting your category filter or search query, or add a new item.</p>
            <button type="button" onClick={openCreateModal} className="store-admin-add-btn">
              <Plus size={16} />
              <span>Create Item</span>
            </button>
          </div>
        </div>
      ) : viewMode === "grid" ? (
        /* ========================================================
            CARDS GRID VIEW WITH EDIT & DELETE ICONS
        ======================================================== */
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
          {filteredItems.map((item) => (
            <div
              key={item.id}
              style={{
                background: "#ffffff",
                borderRadius: "18px",
                overflow: "hidden",
                border: "1.5px solid #e5e7eb",
                boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                display: "flex",
                flexDirection: "column",
                position: "relative",
                transition: "transform 0.2s, box-shadow 0.2s",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "translateY(-3px)";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 10px 28px rgba(0,0,0,0.12)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = "none";
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 2px 12px rgba(0,0,0,0.06)";
              }}
            >
              {/* Card Media Header */}
              <div
                style={{
                  background: "linear-gradient(135deg, #f0f8f3 0%, #e8f0fe 100%)",
                  padding: "24px 16px",
                  textAlign: "center",
                  position: "relative",
                  minHeight: "155px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <div style={{ position: "relative", width: "90px", height: "90px", margin: "0 auto 8px" }}>
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    style={{ objectFit: "contain" }}
                    sizes="90px"
                  />
                </div>

                {/* Badge if present */}
                {item.badge && (
                  <span
                    style={{
                      position: "absolute",
                      top: "12px",
                      left: "12px",
                      fontSize: "0.68rem",
                      fontWeight: 800,
                      padding: "3px 10px",
                      borderRadius: "9999px",
                      background: "#0e3d26",
                      color: "#ffffff",
                      letterSpacing: "0.04em",
                      zIndex: 5,
                    }}
                  >
                    {item.badge}
                  </span>
                )}

                {/* Top-Right Edit and Delete Icons */}
                <div
                  style={{
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    display: "flex",
                    gap: "6px",
                    zIndex: 10,
                  }}
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal(item);
                    }}
                    title="Edit Item"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "9px",
                      background: "#ffffff",
                      border: "1.5px solid #a7d6b6",
                      color: "#0e3d26",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Pencil size={15} />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setDeleteCandidate(item);
                    }}
                    title="Delete Item"
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "9px",
                      background: "#ffffff",
                      border: "1.5px solid #fecaca",
                      color: "#dc2626",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Stock Toggle pill */}
                <button
                  type="button"
                  className={`store-stock-toggle ${item.inStock ? "in-stock" : "out-of-stock"}`}
                  style={{ marginTop: "6px", cursor: "pointer" }}
                  onClick={() => {
                    const updated = { ...item, inStock: !item.inStock };
                    setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
                    fetch("/api/store/items", {
                      method: "PUT",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify(updated),
                    }).catch(() => {});
                    showNotification("success", `"${item.title}" is now ${updated.inStock ? "In Stock" : "Out of Stock"}.`);
                  }}
                >
                  {item.inStock ? "● In Stock" : "○ Out of Stock"}
                </button>
              </div>

              {/* Card Body */}
              <div style={{ padding: "18px 20px", flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                <span className="store-table-category-tag" style={{ alignSelf: "flex-start", margin: 0 }}>
                  {item.category}
                </span>
                <strong style={{ fontSize: "1.02rem", color: "#111827", lineHeight: 1.35 }}>
                  {item.title}
                </strong>
                <p style={{ fontSize: "0.82rem", color: "#6b7280", lineHeight: 1.5, margin: 0, flex: 1 }}>
                  {item.description}
                </p>
                {item.options && item.options.length > 0 && (
                  <div style={{ fontSize: "0.75rem", color: "#4b5563", background: "#f3f4f6", padding: "4px 8px", borderRadius: "6px" }}>
                    <strong>Options:</strong> {item.options.join(", ")}
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" }}>
                  <strong style={{ fontSize: "1.45rem", color: "#0e3d26", fontWeight: 900 }}>
                    ${item.price.toFixed(2)}
                  </strong>
                </div>

                {/* Bottom Edit & Delete Buttons Row */}
                <div style={{ display: "flex", gap: "8px", marginTop: "12px", paddingTop: "12px", borderTop: "1.5px solid #f3f4f6" }}>
                  <button
                    type="button"
                    onClick={() => openEditModal(item)}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      background: "#e8f5ed",
                      color: "#0e3d26",
                      border: "1.5px solid #a7d6b6",
                      borderRadius: "9px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Pencil size={14} /> Edit Item
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(item)}
                    style={{
                      flex: 1,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center",
                      gap: "6px",
                      padding: "8px 12px",
                      background: "#fef2f2",
                      color: "#dc2626",
                      border: "1.5px solid #fecaca",
                      borderRadius: "9px",
                      fontSize: "0.82rem",
                      fontWeight: 700,
                      cursor: "pointer",
                    }}
                  >
                    <Trash2 size={14} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* ========================================================
            DATA TABLE VIEW
        ======================================================== */
        <div className="store-admin-table-card">
          <div className="store-table-responsive">
            <table className="store-admin-table">
              <thead>
                <tr>
                  <th>Item Details</th>
                  <th>Category</th>
                  <th>Price (USD)</th>
                  <th>Badge</th>
                  <th>Inventory Status</th>
                  <th style={{ textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="store-table-item-cell">
                        <div className="store-table-thumb">
                          <Image
                            src={item.image}
                            alt={item.title}
                            fill
                            style={{ objectFit: "contain", padding: "4px" }}
                          />
                        </div>
                        <div className="store-table-item-info">
                          <strong className="store-table-item-title">{item.title}</strong>
                          <p className="store-table-item-desc">{item.description}</p>
                          {item.options && item.options.length > 0 && (
                            <span className="store-table-item-options">
                              Options: {item.options.join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="store-table-category-tag">{item.category}</span>
                    </td>
                    <td>
                      <strong className="store-table-price">${item.price.toFixed(2)}</strong>
                    </td>
                    <td>
                      {item.badge ? (
                        <span className="store-table-badge">{item.badge}</span>
                      ) : (
                        <span style={{ color: "#9ca3af", fontSize: "12px" }}>—</span>
                      )}
                    </td>
                    <td>
                      <button
                        type="button"
                        className={`store-stock-toggle ${
                          item.inStock ? "in-stock" : "out-of-stock"
                        }`}
                        onClick={() => {
                          const updated = { ...item, inStock: !item.inStock };
                          setItems((prev) =>
                            prev.map((i) => (i.id === item.id ? updated : i))
                          );
                          fetch("/api/store/items", {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(updated),
                          }).catch(() => {});
                          showNotification(
                            "success",
                            `Status for "${item.title}" updated to ${
                              updated.inStock ? "In Stock" : "Out of Stock"
                            }.`
                          );
                        }}
                      >
                        {item.inStock ? "● In Stock" : "○ Out of Stock"}
                      </button>
                    </td>
                    <td>
                      <div className="store-table-actions">
                        <button
                          type="button"
                          className="action-btn edit-btn"
                          title="Edit Item"
                          onClick={() => openEditModal(item)}
                        >
                          <Pencil size={15} />
                          <span>Edit</span>
                        </button>
                        <button
                          type="button"
                          className="action-btn delete-btn"
                          title="Delete Item"
                          onClick={() => setDeleteCandidate(item)}
                        >
                          <Trash2 size={15} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MODAL */}
      {modalMode && (
        <div className="upua-modal-backdrop" onClick={() => setModalMode(null)}>
          <div
            className="store-admin-modal-card"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="store-admin-modal-header">
              <div className="modal-title-wrap">
                <Package size={22} color="#0f6a4b" />
                <h3>{modalMode === "create" ? "Add New Store Item" : "Edit Store Item"}</h3>
              </div>
              <button
                type="button"
                className="upua-modal-close-btn"
                style={{ position: "static" }}
                onClick={() => setModalMode(null)}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveItem} className="store-admin-form">
              <div className="store-form-row">
                <div className="store-form-group flex-2">
                  <label>Item Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 2026 Convention Vendor Exhibition Table"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                  />
                </div>

                <div className="store-form-group flex-1">
                  <label>Price (USD) *</label>
                  <div className="price-input-wrap">
                    <span className="price-symbol">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      required
                      placeholder="0.00"
                      value={formPrice}
                      onChange={(e) => setFormPrice(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="store-form-row">
                <div className="store-form-group flex-1">
                  <label>Category *</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as StoreCategory)}
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="store-form-group flex-1">
                  <label>Badge / Ribbon Tag (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Popular, Convention 2026, Handcrafted"
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                  />
                </div>
              </div>

              {/* Graphic / Image selection */}
              <div className="store-form-group">
                <label>Item Illustration / Graphic *</label>
                <div className="graphic-select-row">
                  <div className="graphic-preview-box">
                    <Image
                      src={formImage}
                      alt="Preview"
                      fill
                      style={{ objectFit: "contain", padding: "6px" }}
                    />
                  </div>
                  <div style={{ flex: 1 }}>
                    <select
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      className="graphic-dropdown"
                    >
                      {PRESET_GRAPHICS.map((g) => (
                        <option key={g.value} value={g.value}>
                          {g.label} ({g.value})
                        </option>
                      ))}
                    </select>
                    <small className="form-help-text">
                      Choose from the high-resolution vector assets designed for UPUA regalia, convention booths, publications, and apparel.
                    </small>
                  </div>
                </div>
              </div>

              <div className="store-form-group">
                <label>Item Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of what is included, materials, requirements, or delivery schedule..."
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                />
              </div>

              <div className="store-form-row">
                <div className="store-form-group flex-1">
                  <label>Features &amp; Deliverables (One per line)</label>
                  <textarea
                    rows={3}
                    placeholder="1x 6ft Exhibition table + 2 chairs&#10;2x VIP Attendee passes&#10;Convention Souvenir Directory listing"
                    value={formFeatures}
                    onChange={(e) => setFormFeatures(e.target.value)}
                  />
                  <small className="form-help-text">Bullet points displayed on storefront card.</small>
                </div>

                <div className="store-form-group flex-1">
                  <label>Selectable Options (Comma separated)</label>
                  <input
                    type="text"
                    placeholder="e.g. Small (S), Medium (M), Large (L), XL"
                    value={formOptions}
                    onChange={(e) => setFormOptions(e.target.value)}
                  />
                  <small className="form-help-text">Buyer can choose this option before checkout.</small>
                  
                  <div style={{ marginTop: "14px" }}>
                    <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                      <input
                        type="checkbox"
                        checked={formInStock}
                        onChange={(e) => setFormInStock(e.target.checked)}
                        style={{ width: "16px", height: "16px" }}
                      />
                      <span style={{ fontSize: "13.5px", fontWeight: 700, color: "#111827" }}>
                        In Stock &amp; Available for Purchase
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="store-admin-modal-footer">
                <button
                  type="button"
                  className="modal-cancel-btn"
                  onClick={() => setModalMode(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="modal-submit-btn">
                  {modalMode === "create" ? "Save & Publish Item" : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteCandidate && (
        <div className="upua-modal-backdrop" onClick={() => setDeleteCandidate(null)}>
          <div
            className="store-admin-modal-card confirm-delete-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="delete-icon-wrap">
              <Trash2 size={28} color="#b91c1c" />
            </div>
            <h3>Delete Store Item?</h3>
            <p>
              Are you sure you want to remove <strong>&ldquo;{deleteCandidate.title}&rdquo;</strong> from the store catalog? Buyers will no longer be able to purchase or view this item.
            </p>
            <div className="confirm-delete-actions">
              <button
                type="button"
                className="modal-cancel-btn"
                onClick={() => setDeleteCandidate(null)}
              >
                Keep Item
              </button>
              <button
                type="button"
                className="modal-danger-btn"
                onClick={confirmDeleteItem}
              >
                Yes, Delete Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
