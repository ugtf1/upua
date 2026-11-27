"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
import type { StoreItem } from "@/types";
import { seedStoreItems } from "@/lib/seed-data";
import {
  Search,
  ShoppingCart,
  CheckCircle2,
  X,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Plus,
  Minus,
  Trash2,
  Package,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Lock,
  Loader2,
  Heart,
  Users,
  UserCheck,
  Ticket,
  BadgePercent,
  AlertCircle
} from "lucide-react";

const DONATELY_CAMPAIGN_URL =
  "https://campaigns.donately.com/t005/landing?account_subdomain=upuamerica&campaign_id=cmp_3bf0af489f59";

// StoreItem interface defined in @/types

const storeCategories = [
  "All",
  "Convention Packages",
  "Apparel & Regalia",
  "Accessories",
];

const defaultCatalogItems: StoreItem[] = seedStoreItems;

export interface StoreAttendee {
  id: string;
  name: string;
  type: "Adult" | "Child";
  relationship: string;
  ageGroup?: string;
  dietary?: string;
}

function getItemEffectivePrice(
  item: StoreItem,
  selectedOption?: string,
  customPrice?: number
): number {
  if (typeof customPrice === "number" && customPrice > 0) {
    return customPrice;
  }
  if (selectedOption) {
    const match = selectedOption.match(/\$([0-9,]+(?:\.[0-9]{2})?)/);
    if (match) {
      const parsed = parseFloat(match[1].replace(/,/g, ""));
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
  }
  return item.price;
}

interface CartEntry {
  item: StoreItem;
  quantity: number;
  selectedOption?: string;
  attendees?: StoreAttendee[];
  adultCount?: number;
  childCount?: number;
  customPrice?: number;
}

export default function StorePage() {
  const [storeItemsList, setStoreItemsList] = useState<StoreItem[]>(defaultCatalogItems);

  useEffect(() => {
    // 1. Check local storage synced from Admin console
    try {
      const stored = localStorage.getItem("orgflo_store_items");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setStoreItemsList(parsed);
        }
      }
    } catch {}

    // 2. Fetch from /api/store/items
    fetch("/api/store/items")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.success && Array.isArray(data.data) && data.data.length > 0) {
          setStoreItemsList(data.data);
        }
      })
      .catch(() => {});
  }, []);

  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  // Selected item option map: itemId -> option
  const [itemOptions, setItemOptions] = useState<Record<string, string>>({});

  // Checkout is available only in a local test environment until order verification is implemented.
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");

  // Attendee / Family Pass Registration Modal State
  const [attendeeModalOpen, setAttendeeModalOpen] = useState(false);
  const [attendeeModalItem, setAttendeeModalItem] = useState<StoreItem | null>(null);
  const [adultsCount, setAdultsCount] = useState<number>(1);
  const [childrenCount, setChildrenCount] = useState<number>(0);
  const [attendeeFormError, setAttendeeFormError] = useState("");
  const [attendeesList, setAttendeesList] = useState<StoreAttendee[]>([
    {
      id: "att-adult-1",
      name: "",
      type: "Adult",
      relationship: "Self / Primary",
      dietary: "Authentic Urhobo Assorted (Oghwo / Banga / Starch)",
    },
  ]);

  const openAttendeeModal = (item: StoreItem) => {
    setAttendeeModalItem(item);
    setAdultsCount(1);
    setChildrenCount(0);
    setAttendeeFormError("");
    setAttendeesList([
      {
        id: "att-adult-1",
        name: "",
        type: "Adult",
        relationship: "Self / Primary",
        dietary: "Authentic Urhobo Assorted (Oghwo / Banga / Starch)",
      },
    ]);
    setAttendeeModalOpen(true);
  };

  const handleUpdateCounts = (newAdults: number, newChildren: number) => {
    if (newAdults < 1) return;
    if (newChildren < 0) return;

    setAdultsCount(newAdults);
    setChildrenCount(newChildren);

    setAttendeesList((prev) => {
      const currentAdults = prev.filter((a) => a.type === "Adult");
      const currentChildren = prev.filter((a) => a.type === "Child");

      // Adjust adults
      let nextAdults = [...currentAdults];
      if (newAdults > nextAdults.length) {
        for (let i = nextAdults.length; i < newAdults; i++) {
          nextAdults.push({
            id: `att-adult-${i + 1}-${Date.now()}`,
            name: "",
            type: "Adult",
            relationship: i === 1 ? "Wife / Spouse" : "Adult Family / Guest",
            dietary: "Authentic Urhobo Assorted (Oghwo / Banga / Starch)",
          });
        }
      } else if (newAdults < nextAdults.length) {
        nextAdults = nextAdults.slice(0, newAdults);
      }

      // Adjust children
      let nextChildren = [...currentChildren];
      if (newChildren > nextChildren.length) {
        for (let i = nextChildren.length; i < newChildren; i++) {
          nextChildren.push({
            id: `att-child-${i + 1}-${Date.now()}`,
            name: "",
            type: "Child",
            relationship: i === 0 ? "Son" : i === 1 ? "Daughter" : "Child (Son / Daughter)",
            ageGroup: "Child (3-12 yrs)",
            dietary: "Standard Banquet Plate",
          });
        }
      } else if (newChildren < nextChildren.length) {
        nextChildren = nextChildren.slice(0, newChildren);
      }

      return [...nextAdults, ...nextChildren];
    });
  };

  const handleApplyPreset = (adults: number, children: number) => {
    handleUpdateCounts(adults, children);
  };

  const updateAttendeeField = (
    index: number,
    field: keyof StoreAttendee,
    value: string
  ) => {
    setAttendeesList((prev) =>
      prev.map((att, i) => (i === index ? { ...att, [field]: value } : att))
    );
  };

  const computedModalTotal = adultsCount * 150 + childrenCount * 50;

  const handleConfirmAttendeeRegistration = (immediateCheckout: boolean = false) => {
    if (!attendeeModalItem) return;
    setAttendeeFormError("");

    // Validate that every attendee has a name
    const missing = attendeesList.find((a) => !a.name.trim());
    if (missing) {
      setAttendeeFormError(
        `Please enter the full name for every registered individual (${missing.type}: ${missing.relationship || "Guest"}).`
      );
      return;
    }

    const packageSummary = `${adultsCount} Adult${adultsCount > 1 ? "s" : ""}, ${childrenCount} Child${childrenCount !== 1 ? "ren" : ""} ($${computedModalTotal})`;

    const newEntry: CartEntry = {
      item: {
        ...attendeeModalItem,
        price: computedModalTotal,
      },
      quantity: 1,
      selectedOption: packageSummary,
      adultCount: adultsCount,
      childCount: childrenCount,
      customPrice: computedModalTotal,
      attendees: [...attendeesList],
    };

    setCart((prev) => [...prev, newEntry]);
    setAttendeeModalOpen(false);

    if (immediateCheckout) {
      setIsCheckoutOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  // Load cart from localStorage on client mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("upua_store_cart");
      if (saved) setCart(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  // Save cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("upua_store_cart", JSON.stringify(cart));
    } catch {
      // ignore
    }
  }, [cart]);

  const addToCart = (item: StoreItem, immediateCheckout = false) => {
    const selectedOption = itemOptions[item.id] || (item.options ? item.options[0] : undefined);
    const effectivePrice = getItemEffectivePrice(item, selectedOption);
    const itemWithPrice: StoreItem = { ...item, price: effectivePrice };

    setCart((prev) => {
      const existing = prev.find(
        (c) => c.item.id === item.id && c.selectedOption === selectedOption
      );
      if (existing) {
        return prev.map((c) =>
          c.item.id === item.id && c.selectedOption === selectedOption
            ? { ...c, quantity: c.quantity + 1 }
            : c
        );
      }
      return [...prev, { item: itemWithPrice, quantity: 1, selectedOption }];
    });

    if (immediateCheckout) {
      setIsCheckoutOpen(true);
    } else {
      setIsCartOpen(true);
    }
  };

  const updateQuantity = (itemId: string, selectedOption: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((c) => {
          if (c.item.id === itemId && c.selectedOption === selectedOption) {
            const nextQty = c.quantity + delta;
            return nextQty > 0 ? { ...c, quantity: nextQty } : null;
          }
          return c;
        })
        .filter(Boolean) as CartEntry[]
    );
  };

  const removeFromCart = (itemId: string, selectedOption: string | undefined) => {
    setCart((prev) =>
      prev.filter((c) => !(c.item.id === itemId && c.selectedOption === selectedOption))
    );
  };

  const totalItemsCount = cart.reduce((sum, c) => sum + c.quantity, 0);
  const subtotal = cart.reduce(
    (sum, c) =>
      sum + getItemEffectivePrice(c.item, c.selectedOption, c.customPrice) * c.quantity,
    0
  );
  // Free shipping for convention packages, flat $8 for apparel/items
  const hasPhysicalGoods = cart.some((c) => c.item.category !== "Convention Packages");
  const shippingCost = cart.length === 0 ? 0 : hasPhysicalGoods ? 8 : 0;
  const orderTotal = subtotal + shippingCost;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");
    if (cart.some((entry) => entry.attendees?.length)) {
      setOrderError("Event registrations are not available in the checkout test.");
      return;
    }
    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map((entry) => ({
            productId: entry.item.id,
            quantity: entry.quantity,
            ...(entry.selectedOption ? { selectedOption: entry.selectedOption } : {}),
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok || typeof data.url !== "string") throw new Error(data.error || "Checkout is not available yet.");
      const destination = new URL(data.url);
      if (destination.protocol !== "https:" || destination.hostname !== "checkout.stripe.com" || destination.port || destination.username || destination.password) throw new Error("Invalid checkout destination.");
      window.location.assign(destination.href);
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : "Checkout is not available yet.");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = storeItemsList.filter((item) => {
    const matchCategory = activeCategory === "All" || item.category === activeCategory;
    const matchSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCategory && matchSearch;
  });

  return (
    <div className="figma-landing-page">
      <SiteHeader />

      {/* Hero Section */}
      <section className="page-hero blog-hero">
        <Image
          src="/assets/Congress-1.jpg"
          alt="UPUA Official Store and Merchandise"
          fill
          priority
          style={{ objectFit: "cover", objectPosition: "center 30%" }}
        />
        <div className="page-hero-overlay" />
        <div className="page-hero-inner">
          <p className="page-hero-tag">Public Community Store</p>
          <h1>
            UPUA Store &amp; <span className="heading-gold-accent">Convention Packages</span>
          </h1>
          <p className="page-hero-sub">
            Browse convention packages, cultural regalia, and official memorabilia. Online checkout is not yet available.
          </p>

          <div style={{ marginTop: "20px", display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: "center" }}>
            <button
              type="button"
              onClick={() => setIsCartOpen(true)}
              className="store-hero-cart-btn"
            >
              <ShoppingCart size={18} />
              <span>View Cart ({totalItemsCount})</span>
            </button>
            <a
              href={DONATELY_CAMPAIGN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="store-hero-donate-btn"
              title="Donate to 2026 UPUA Convention Campaign on Donately"
            >
              <Heart size={18} color="#04140b" fill="#04140b" />
              <span>Donate via Donately</span>
              <ExternalLink size={15} color="#04140b" />
            </a>
          </div>
        </div>
      </section>

      {/* Floating Cart Button for Mobile & Desktop */}
      {totalItemsCount > 0 && !isCartOpen && !isCheckoutOpen && (
        <button
          type="button"
          className="store-floating-cart-pill"
          onClick={() => setIsCartOpen(true)}
          aria-label="Open cart"
        >
          <ShoppingCart size={20} />
          <span>Cart ({totalItemsCount}) &bull; ${subtotal.toFixed(2)}</span>
          <ChevronRight size={18} />
        </button>
      )}

      {/* Trust & Guarantee Banner */}
      <section className="store-trust-banner">
        <div className="store-trust-inner">
          <div className="store-trust-item">
            <ShieldCheck size={20} color="#0f6a4b" />
            <div>
              <strong>Online checkout</strong>
              <small>Not yet available</small>
            </div>
          </div>
          <div className="store-trust-item">
            <Package size={20} color="#0f6a4b" />
            <div>
              <strong>Convention &amp; Merchandise</strong>
              <small>Browse available items</small>
            </div>
          </div>
          <div className="store-trust-item">
            <Sparkles size={20} color="#0f6a4b" />
            <div>
              <strong>No Portal Login Required</strong>
              <small>Open to members, guests &amp; vendors</small>
            </div>
          </div>
        </div>
      </section>

      {/* Donately Integrated Convention Campaign Giving Callout */}
      <section className="store-donate-callout-section">
        <div className="store-donate-callout-inner">
          <div className="store-donate-callout-content">
            <div className="store-donate-callout-badge">
              <Heart size={14} fill="#f5c037" color="#f5c037" />
              <span>2026 National Convention Campaign</span>
            </div>
            <h2>
              Support the Urhobo Progress Union America <span className="heading-gold-accent">on Donately</span>
            </h2>
            <p>
              Looking to make an official philanthropic donation, convention pledge, or support the host chapter directly? Give securely through our official Donately campaign. All contributions directly empower convention operations, youth initiatives, STEM labs, and diaspora welfare.
            </p>
            <div className="store-donate-callout-tags">
              <span>✓ Official Donately Campaign</span>
              <span>✓ Instant Tax-Deductible Receipt</span>
              <span>✓ Debit, Credit &amp; Bank Transfer</span>
            </div>
          </div>

          <div className="store-donate-callout-action">
            <a
              href={DONATELY_CAMPAIGN_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="store-donate-callout-btn"
              title="Open Donately Campaign in New Tab"
            >
              <Heart size={18} fill="#062316" color="#062316" />
              <span>Donate on Donately</span>
              <ExternalLink size={16} />
            </a>
            <small>Opens secure Donately checkout in a new tab</small>
          </div>
        </div>
      </section>

      {/* Filter and Search Bar */}
      <section className="blog-filter-section">
        <div className="blog-filter-inner">
          <div className="blog-category-pills">
            {storeCategories.map((cat) => (
              <button
                key={cat}
                type="button"
                className={`blog-pill ${activeCategory === cat ? "active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="blog-search-wrap">
            <Search size={16} color="#667085" />
            <input
              type="text"
              className="blog-search-input"
              placeholder="Search store items, packages, regalia..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* Store Catalog Grid */}
      <section className="store-catalog-section">
        <div className="store-catalog-inner">
          {filteredItems.length === 0 ? (
            <div className="blog-empty">
              <p>No store items match your filter. Try another keyword or select "All".</p>
            </div>
          ) : (
            <div className="store-grid">
              {filteredItems.map((item) => {
                const currentOption =
                  itemOptions[item.id] || (item.options ? item.options[0] : "");

                return (
                  <article className="store-card" key={item.id}>
                    <div className="store-card-media">
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 360px"
                        className="store-card-img"
                      />
                      {item.badge && (
                        <span className="store-badge">{item.badge}</span>
                      )}
                      <span className="store-category-tag">{item.category}</span>
                    </div>

                    <div className="store-card-body">
                      <div className="store-card-price-row">
                        <span className="store-price">${getItemEffectivePrice(item, currentOption).toFixed(2)}</span>
                        <span className="store-stock-tag">In Stock</span>
                      </div>

                      <h3 className="store-title">{item.title}</h3>
                      <p className="store-desc">{item.description}</p>

                      {/* Options selector (e.g. Size, Cut) */}
                      {item.options && item.options.length > 0 && (
                        <div className="store-options-wrap">
                          <label className="store-option-label">Select Option:</label>
                          <select
                            className="store-select"
                            value={currentOption}
                            onChange={(e) =>
                              setItemOptions((prev) => ({
                                ...prev,
                                [item.id]: e.target.value,
                              }))
                            }
                          >
                            {item.options.map((opt) => (
                              <option key={opt} value={opt}>
                                {opt}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}

                      {/* Key features bullet points */}
                      <ul className="store-features-list">
                        {item.features.slice(0, 2).map((feat, i) => (
                          <li key={i}>
                            <CheckCircle2 size={13} color="#0f6a4b" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>

                      {item.id === "convention-cultural-gala-ticket" ||
                      item.title.toLowerCase().includes("gala") ||
                      item.title.toLowerCase().includes("banquet pass") ? (
                        <div style={{ marginTop: "auto", display: "flex", flexDirection: "column", gap: "8px", paddingTop: "14px", borderTop: "1px solid #f3f4f6" }}>
                          <div className="store-family-ticket-banner">
                            <div className="store-family-ticket-pill">
                              <Users size={12} />
                              <span>Family &amp; Multi-Attendee Registration</span>
                            </div>
                            <p className="store-family-ticket-note">
                              Register husband, wife, and children with individual names. Adult: $150 &bull; Child (3-12 yrs): $50.
                            </p>
                          </div>
                          <button
                            type="button"
                            className="store-configure-attendees-btn"
                            onClick={() => openAttendeeModal(item)}
                          >
                            <Ticket size={16} />
                            <span>Configure Attendees &amp; Passes</span>
                          </button>
                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            <button
                              type="button"
                              className="store-add-btn"
                              onClick={() => openAttendeeModal(item)}
                            >
                              <Users size={14} />
                              <span>Custom Group</span>
                            </button>
                            <Link
                              href="/events/tickets"
                              className="store-buy-btn"
                              style={{ textDecoration: "none", fontSize: "11px", textAlign: "center" }}
                            >
                              <span>E-Ticket Portal &rarr;</span>
                            </Link>
                          </div>
                        </div>
                      ) : (
                        <div className="store-card-actions">
                          <button
                            type="button"
                            className="store-add-btn"
                            onClick={() => addToCart(item, false)}
                          >
                            <ShoppingCart size={15} />
                            <span>Add to Cart</span>
                          </button>
                          <button
                            type="button"
                            className="store-buy-btn"
                            onClick={() => addToCart(item, true)}
                          >
                            <span>Buy Now</span>
                            <ArrowRight size={15} />
                          </button>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Shopping Cart Slide-over Drawer */}
      {isCartOpen && (
        <div className="upua-modal-backdrop" onClick={() => setIsCartOpen(false)}>
          <div
            className="store-cart-drawer"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Shopping Cart"
          >
            <div className="store-cart-header">
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <ShoppingCart size={22} color="#0e3d26" />
                <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0e3d26", fontWeight: 800 }}>
                  Your Cart ({totalItemsCount})
                </h3>
              </div>
              <button
                type="button"
                className="upua-modal-close-btn"
                style={{ position: "static" }}
                onClick={() => setIsCartOpen(false)}
                aria-label="Close cart"
              >
                <X size={20} />
              </button>
            </div>

            <div className="store-cart-items-body">
              {cart.length === 0 ? (
                <div style={{ textAlign: "center", padding: "48px 20px", color: "#6b7280" }}>
                  <Package size={48} strokeWidth={1.5} style={{ margin: "0 auto 16px", color: "#9ca3af" }} />
                  <h4 style={{ color: "#374151", margin: "0 0 6px", fontSize: "16px" }}>Your cart is empty</h4>
                  <p style={{ fontSize: "13.5px", margin: 0 }}>Add convention packages or official merchandise to checkout.</p>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {cart.map((entry, idx) => (
                    <div className="store-cart-item-row" key={`${entry.item.id}-${entry.selectedOption || idx}`}>
                      <div className="store-cart-item-thumb">
                        <Image
                          src={entry.item.image}
                          alt={entry.item.title}
                          fill
                          style={{ objectFit: "contain", padding: "4px" }}
                        />
                      </div>
                      <div className="store-cart-item-info">
                        <h4 className="store-cart-item-title">{entry.item.title}</h4>
                        {entry.selectedOption && (
                          <span style={{ fontSize: "11px", color: "#0f6a4b", fontWeight: 700 }}>
                            Option: {entry.selectedOption}
                          </span>
                        )}
                        <span className="store-cart-item-price">
                          ${getItemEffectivePrice(entry.item, entry.selectedOption, entry.customPrice).toFixed(2)}
                          {entry.quantity > 1 ? ` (${entry.quantity}x)` : ""}
                        </span>

                        {entry.attendees && entry.attendees.length > 0 && (
                          <div className="store-cart-attendees-box">
                            <div className="store-cart-attendees-header">
                              <Users size={12} />
                              <span>Registered Individuals ({entry.attendees.length}):</span>
                            </div>
                            <div className="store-cart-attendees-list">
                              {entry.attendees.map((att, aIdx) => (
                                <div key={aIdx} className="store-cart-attendee-chip">
                                  <span className={`store-att-type-badge ${att.type.toLowerCase()}`}>
                                    {att.type}
                                  </span>
                                  <span className="store-att-name">{att.name}</span>
                                  {att.relationship && (
                                    <span className="store-att-rel">({att.relationship})</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="store-cart-qty-row">
                          <button
                            type="button"
                            className="store-qty-btn"
                            onClick={() => updateQuantity(entry.item.id, entry.selectedOption, -1)}
                            aria-label="Decrease quantity"
                          >
                            <Minus size={13} />
                          </button>
                          <span style={{ fontSize: "13px", fontWeight: 700, minWidth: "18px", textAlign: "center" }}>
                            {entry.quantity}
                          </span>
                          <button
                            type="button"
                            className="store-qty-btn"
                            onClick={() => updateQuantity(entry.item.id, entry.selectedOption, 1)}
                            aria-label="Increase quantity"
                          >
                            <Plus size={13} />
                          </button>
                          <button
                            type="button"
                            className="store-remove-btn"
                            onClick={() => removeFromCart(entry.item.id, entry.selectedOption)}
                            aria-label="Remove item"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="store-cart-footer">
                <div className="store-cart-summary-line">
                  <span>Subtotal</span>
                  <strong>${subtotal.toFixed(2)}</strong>
                </div>
                <div className="store-cart-summary-line">
                  <span>Shipping &amp; Handling</span>
                  <span>{shippingCost === 0 ? "FREE" : `$${shippingCost.toFixed(2)}`}</span>
                </div>
                <div className="store-cart-summary-line store-total-line">
                  <span>Total Due</span>
                  <span className="store-total-amount">${orderTotal.toFixed(2)}</span>
                </div>

                <button
                  type="button"
                  className="store-checkout-cta"
                  onClick={() => {
                    setIsCartOpen(false);
                    setIsCheckoutOpen(true);
                                }}
                >
                  <Lock size={16} />
                  <span>Proceed to Checkout &bull; ${orderTotal.toFixed(2)}</span>
                </button>
                <div style={{ textAlign: "center", fontSize: "11.5px", color: "#6b7280", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <ShieldCheck size={14} color="#0f6a4b" />
                  <span>Online checkout not yet available</span>
                </div>

                <div className="store-cart-donate-hint">
                  <span>Want to make an official donation instead?</span>
                  <a
                    href={DONATELY_CAMPAIGN_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Donate on Donately <ExternalLink size={12} />
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout is a local sandbox prototype; live payments remain disabled. */}
      {isCheckoutOpen && (
        <div className="upua-modal-backdrop" onClick={() => !isProcessing && setIsCheckoutOpen(false)}>
          <div className="store-checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button type="button" className="upua-modal-close-btn" onClick={() => !isProcessing && setIsCheckoutOpen(false)} aria-label="Close checkout"><X size={20} /></button>
            <form onSubmit={handleCheckoutSubmit} className="store-checkout-form">
              <div className="store-checkout-header"><h3>Checkout</h3></div>
              <p>Online purchases are not available yet. No orders or registrations will be fulfilled.</p>
              {orderError && <div className="store-error-banner" role="alert">{orderError}</div>}
              <div className="store-form-actions">
                <button type="button" className="store-back-btn" disabled={isProcessing} onClick={() => { setIsCheckoutOpen(false); setIsCartOpen(true); }}>Back to Cart</button>
                {process.env.NODE_ENV === "development" && (
                  <button type="submit" className="store-checkout-cta" disabled={isProcessing || cart.length === 0}>
                    {isProcessing ? <><Loader2 size={16} className="animate-spin" /> Opening test checkout...</> : "Continue to test checkout"}
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attendee / Family Pass Registration Modal */}
      {attendeeModalOpen && attendeeModalItem && (
        <div className="upua-modal-backdrop" onClick={() => setAttendeeModalOpen(false)}>
          <div
            className="store-attendee-modal"
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-label="Register Attendees"
          >
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => setAttendeeModalOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="store-attendee-modal-inner">
              <div className="store-attendee-header">
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "#e8f5ec", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Users size={20} color="#0e3d26" />
                  </div>
                  <div>
                    <h3 style={{ margin: 0, fontSize: "1.25rem", color: "#0e3d26", fontWeight: 800 }}>
                      Register Gala &amp; Banquet Attendees
                    </h3>
                    <span style={{ fontSize: "12px", color: "#d4af37", fontWeight: 700 }}>
                      National Cultural Gala &amp; Royal Banquet &bull; Sat, Sept 5, 2026
                    </span>
                  </div>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: "13px", color: "#475467" }}>
                  Enter details for <strong>every individual</strong> (husband, wife, children &amp; guests). Full names are recorded for individual banquet badges, seating tags, and official credentials.
                </p>
              </div>

              {/* Quick Family Presets */}
              <div>
                <label style={{ fontSize: "11.5px", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.04em", color: "#667085" }}>
                  Quick Family / Party Presets:
                </label>
                <div className="store-attendee-preset-wrap">
                  <button
                    type="button"
                    className={`store-attendee-preset-btn ${adultsCount === 1 && childrenCount === 0 ? "active" : ""}`}
                    onClick={() => handleApplyPreset(1, 0)}
                  >
                    👤 1 Adult ($150)
                  </button>
                  <button
                    type="button"
                    className={`store-attendee-preset-btn ${adultsCount === 2 && childrenCount === 0 ? "active" : ""}`}
                    onClick={() => handleApplyPreset(2, 0)}
                  >
                    👫 Couple ($300)
                  </button>
                  <button
                    type="button"
                    className={`store-attendee-preset-btn ${adultsCount === 2 && childrenCount === 1 ? "active" : ""}`}
                    onClick={() => handleApplyPreset(2, 1)}
                  >
                    👨‍👩‍👧 Family (2 Adults + 1 Child &bull; $350)
                  </button>
                  <button
                    type="button"
                    className={`store-attendee-preset-btn ${adultsCount === 2 && childrenCount === 2 ? "active" : ""}`}
                    onClick={() => handleApplyPreset(2, 2)}
                  >
                    👨‍👩‍👧‍👦 Family (2 Adults + 2 Kids &bull; $400)
                  </button>
                  <button
                    type="button"
                    className={`store-attendee-preset-btn ${adultsCount === 2 && childrenCount === 3 ? "active" : ""}`}
                    onClick={() => handleApplyPreset(2, 3)}
                  >
                    👨‍👩‍👧‍👧 Family (2 Adults + 3 Kids &bull; $450)
                  </button>
                </div>
              </div>

              {/* Quantity Selectors */}
              <div className="store-counter-grid">
                <div className="store-counter-card">
                  <div>
                    <strong style={{ display: "block", color: "#0e3d26", fontSize: "14.5px" }}>
                      Adult Passes
                    </strong>
                    <span style={{ fontSize: "12px", color: "#0f6a4b", fontWeight: 700 }}>
                      $150.00 each
                    </span>
                  </div>
                  <div className="store-counter-controls">
                    <button
                      type="button"
                      className="store-counter-btn"
                      disabled={adultsCount <= 1}
                      onClick={() => handleUpdateCounts(adultsCount - 1, childrenCount)}
                      aria-label="Decrease adults"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: "15px", fontWeight: 800, minWidth: "24px", textAlign: "center" }}>
                      {adultsCount}
                    </span>
                    <button
                      type="button"
                      className="store-counter-btn"
                      onClick={() => handleUpdateCounts(adultsCount + 1, childrenCount)}
                      aria-label="Increase adults"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="store-counter-card">
                  <div>
                    <strong style={{ display: "block", color: "#0e3d26", fontSize: "14.5px" }}>
                      Children Passes (Ages 3–12)
                    </strong>
                    <span style={{ fontSize: "12px", color: "#d4af37", fontWeight: 700 }}>
                      $50.00 each (Under 2 Free)
                    </span>
                  </div>
                  <div className="store-counter-controls">
                    <button
                      type="button"
                      className="store-counter-btn"
                      disabled={childrenCount <= 0}
                      onClick={() => handleUpdateCounts(adultsCount, childrenCount - 1)}
                      aria-label="Decrease children"
                    >
                      <Minus size={14} />
                    </button>
                    <span style={{ fontSize: "15px", fontWeight: 800, minWidth: "24px", textAlign: "center" }}>
                      {childrenCount}
                    </span>
                    <button
                      type="button"
                      className="store-counter-btn"
                      onClick={() => handleUpdateCounts(adultsCount, childrenCount + 1)}
                      aria-label="Increase children"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>
              </div>

              {/* Attendee Roster Form */}
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "6px" }}>
                  <h4 style={{ margin: 0, fontSize: "14px", fontWeight: 800, color: "#0e3d26" }}>
                    Attendee Roster ({attendeesList.length} Individual{attendeesList.length > 1 ? "s" : ""})
                  </h4>
                  <span style={{ fontSize: "12px", color: "#667085" }}>
                    Please enter each individual's full name
                  </span>
                </div>

                {attendeeFormError && (
                  <div className="store-error-banner" style={{ marginBottom: "14px", display: "flex", alignItems: "center", gap: "8px" }}>
                    <AlertCircle size={16} />
                    <span>{attendeeFormError}</span>
                  </div>
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {attendeesList.map((att, idx) => {
                    const isAdult = att.type === "Adult";
                    return (
                      <div
                        key={att.id || idx}
                        className={`store-attendee-card ${isAdult ? "adult" : "child"}`}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                          <span className={`store-attendee-badge ${isAdult ? "adult" : "child"}`}>
                            {isAdult ? "Adult Pass ($150)" : "Child Pass ($50)"} &bull; #{idx + 1}
                          </span>
                          <span style={{ fontSize: "11px", color: "#667085", fontWeight: 600 }}>
                            {idx === 0
                              ? "Primary / Purchaser"
                              : idx === 1 && isAdult
                              ? "Spouse / Partner"
                              : att.relationship || att.type}
                          </span>
                        </div>

                        <div className="store-form-row">
                          <div className="store-input-wrap">
                            <label style={{ fontSize: "12px" }}>
                              Full Name *
                            </label>
                            <input
                              type="text"
                              required
                              placeholder={
                                idx === 0
                                  ? "e.g. Chief Oghenemaro Davis"
                                  : idx === 1 && isAdult
                                  ? "e.g. Mrs. Ese Davis (Wife)"
                                  : isAdult
                                  ? "e.g. Adult Family / Guest Name"
                                  : "e.g. Tega Davis (Child)"
                              }
                              value={att.name}
                              onChange={(e) => updateAttendeeField(idx, "name", e.target.value)}
                            />
                          </div>

                          <div className="store-input-wrap">
                            <label style={{ fontSize: "12px" }}>
                              Relationship / Role
                            </label>
                            <select
                              value={att.relationship}
                              onChange={(e) => updateAttendeeField(idx, "relationship", e.target.value)}
                            >
                              {isAdult ? (
                                <>
                                  <option value="Self / Primary">Self / Primary Purchaser</option>
                                  <option value="Wife / Spouse">Wife / Spouse</option>
                                  <option value="Husband / Spouse">Husband / Spouse</option>
                                  <option value="Brother">Brother</option>
                                  <option value="Sister">Sister</option>
                                  <option value="Adult Son">Adult Son (18+)</option>
                                  <option value="Adult Daughter">Adult Daughter (18+)</option>
                                  <option value="Guest">Guest / Supporter</option>
                                </>
                              ) : (
                                <>
                                  <option value="Son">Son</option>
                                  <option value="Daughter">Daughter</option>
                                  <option value="Ward">Ward</option>
                                  <option value="Niece">Niece</option>
                                  <option value="Nephew">Nephew</option>
                                  <option value="Junior Guest">Junior Guest</option>
                                </>
                              )}
                            </select>
                          </div>
                        </div>

                        <div className="store-input-wrap" style={{ marginTop: "8px" }}>
                          <label style={{ fontSize: "11.5px" }}>
                            {isAdult ? "Banquet 3-Course Dinner Choice" : "Kids Meal Preference"}
                          </label>
                          <select
                            value={att.dietary || ""}
                            onChange={(e) => updateAttendeeField(idx, "dietary", e.target.value)}
                          >
                            {isAdult ? (
                              <>
                                <option value="Authentic Urhobo Assorted (Oghwo / Banga / Starch)">
                                  Authentic Urhobo Assorted (Oghwo / Banga / Starch)
                                </option>
                                <option value="Grilled Fish &amp; Roasted Plantain">
                                  Grilled Fish &amp; Roasted Plantain
                                </option>
                                <option value="Vegetarian / Vegan Platter">
                                  Vegetarian / Vegan Platter
                                </option>
                                <option value="Chef's Choice Banquet Platter">
                                  Chef's Choice Banquet Platter
                                </option>
                              </>
                            ) : (
                              <>
                                <option value="Standard Kids Banquet Plate">
                                  Standard Kids Banquet Plate (Chicken &amp; Rice / Fries)
                                </option>
                                <option value="Urhobo Traditional Junior Plate">
                                  Urhobo Traditional Junior Plate
                                </option>
                                <option value="Kids Vegetarian Meal">
                                  Kids Vegetarian Meal
                                </option>
                              </>
                            )}
                          </select>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Price Calculation Card */}
              <div style={{ background: "#f8faf9", border: "1.5px solid #d1ded6", borderRadius: "12px", padding: "16px", marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#475467", marginBottom: "6px" }}>
                  <span>Adult Passes ({adultsCount} &times; $150.00)</span>
                  <strong>${(adultsCount * 150).toFixed(2)}</strong>
                </div>
                {childrenCount > 0 && (
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#475467", marginBottom: "6px" }}>
                    <span>Children Passes ({childrenCount} &times; $50.00)</span>
                    <strong>${(childrenCount * 50).toFixed(2)}</strong>
                  </div>
                )}
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "16px", color: "#0e3d26", fontWeight: 800, borderTop: "1px dashed #cfd8d3", paddingTop: "8px", marginTop: "4px" }}>
                  <span>Total Pass Package:</span>
                  <span style={{ color: "#0f6a4b", fontSize: "1.25rem" }}>
                    ${computedModalTotal.toFixed(2)} USD
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                  <button
                    type="button"
                    className="store-add-btn"
                    style={{ padding: "12px 16px", fontSize: "13.5px" }}
                    onClick={() => handleConfirmAttendeeRegistration(false)}
                  >
                    <ShoppingCart size={16} />
                    <span>Add to Cart</span>
                  </button>
                  <button
                    type="button"
                    className="store-buy-btn"
                    style={{ padding: "12px 16px", fontSize: "13.5px" }}
                    onClick={() => handleConfirmAttendeeRegistration(true)}
                  >
                    <CreditCard size={16} />
                    <span>View checkout &bull; ${computedModalTotal}</span>
                  </button>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "6px", fontSize: "12px", flexWrap: "wrap", gap: "6px" }}>
                  <Link
                    href="/events/tickets"
                    style={{ color: "#0e3d26", fontWeight: 700, display: "inline-flex", alignItems: "center", gap: "4px" }}
                  >
                    <span>Prefer the Full-Screen Luxury E-Ticket Studio?</span>
                    <ExternalLink size={12} />
                  </Link>
                  <span style={{ color: "#667085" }}>
                    Online checkout not yet available
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Help & Support Banner */}
      <section className="blog-newsletter-section">
        <div className="blog-newsletter-inner">
          <h2>
            Need Assistance with an <span className="heading-gold-accent">Order?</span>
          </h2>
          <p>
            For corporate sponsorships, bulk chapter regalia orders, or custom vendor placement requests, contact the UPUA National Secretariat directly.
          </p>
          <div style={{ marginTop: "16px", display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="mailto:secretariat@upuamerica.org"
              className="store-support-pill"
            >
              ✉️ secretariat@upuamerica.org
            </a>
            <a
              href="tel:7638787565"
              className="store-support-pill"
            >
              📞 (763) 878-7565
            </a>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
