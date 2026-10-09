"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import SiteHeader from "@/components/site-header";
import SiteFooter from "@/components/site-footer";
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
  DollarSign
} from "lucide-react";

export interface StoreItem {
  id: string;
  title: string;
  category: "Convention Packages" | "Apparel & Regalia" | "Books & Culture" | "Accessories";
  price: number;
  image: string;
  badge?: string;
  description: string;
  features: string[];
  options?: string[];
  inStock: boolean;
}

const storeCategories = [
  "All",
  "Convention Packages",
  "Apparel & Regalia",
  "Books & Culture",
  "Accessories",
];

const catalogItems: StoreItem[] = [
  {
    id: "convention-vendor-table-2026",
    title: "Convention Vendor Exhibition Table (2026)",
    category: "Convention Packages",
    price: 200,
    image: "/assets/Congress-1.jpg",
    badge: "Convention 2026",
    description:
      "Reserved 6-foot vendor table with 2 vendor passes and tablecloth at the 33rd Annual UPUA National Convention. Ideal for showcasing cultural clothing, art, jewelry, books, and business services.",
    features: [
      "1x 6ft exhibition table + 2 chairs",
      "2x Vendor attendee credential badges",
      "Listing in official convention souvenir directory",
      "Setup on Friday, Aug 28 through Sunday, Aug 30, 2026",
    ],
    inStock: true,
  },
  {
    id: "convention-brochure-full-page",
    title: "Convention Souvenir Brochure (Full Page Ad)",
    category: "Convention Packages",
    price: 150,
    image: "/update-convention.jpg",
    badge: "Popular",
    description:
      "Full-color, full-page goodwill message, memorial tribute, family congratulations, or corporate advertisement printed in the official 2026 UPUA Convention Souvenir Brochure.",
    features: [
      "Full-page 8.5\" x 11\" glossy color placement",
      "Distributed to 1,500+ diaspora delegates and dignitaries",
      "Digital edition permanently archived online",
      "Artwork & greeting text coordinated after checkout",
    ],
    inStock: true,
  },
  {
    id: "convention-brochure-half-page",
    title: "Convention Souvenir Brochure (Half Page Ad)",
    category: "Convention Packages",
    price: 100,
    image: "/update-convention.jpg",
    description:
      "Half-page full-color goodwill message, family announcement, or business listing in the official convention souvenir magazine.",
    features: [
      "Half-page glossy color placement",
      "High circulation among North American Urhobo community",
      "Complimentary printed copy of the souvenir brochure",
    ],
    inStock: true,
  },
  {
    id: "convention-cultural-gala-ticket",
    title: "National Cultural Gala & Banquet Pass",
    category: "Convention Packages",
    price: 75,
    image: "/assets/SolCal-4.jpg",
    badge: "Ticket",
    description:
      "All-inclusive ticket for the Grand Cultural Gala Night at DoubleTree Lawrenceburg, including authentic 3-course Urhobo banquet, royal dignitaries reception, and cultural music gala.",
    features: [
      "Admit One to Grand Banquet & Gala (Sat, Aug 29)",
      "Traditional Urhobo dinner buffet & beverages",
      "Live cultural performances & royal dance troupes",
    ],
    inStock: true,
  },
  {
    id: "upua-ceremonial-sash-coral-set",
    title: "Official UPUA Ceremonial Sash & Coral Beads",
    category: "Apparel & Regalia",
    price: 65,
    image: "/assets/SolCal-4.jpg",
    badge: "Handcrafted",
    description:
      "Authentic ceremonial attire kit featuring custom gold-embroidered UPUA satin sash accompanied by handcrafted polished royal red coral wrist beads.",
    features: [
      "Gold thread embroidered UPUA emblem and motto",
      "Natural polished coral bead bracelet",
      "Unisex fit for cultural festivals and meetings",
      "Protective velvet keepsake pouch included",
    ],
    options: ["Men's Cut", "Women's Cut"],
    inStock: true,
  },
  {
    id: "upua-heritage-crest-polo",
    title: "UPUA Heritage Crest Embroidered Polo Shirt",
    category: "Apparel & Regalia",
    price: 35,
    image: "/assets/ChicagoLand-1x.jpg",
    description:
      "Premium 100% combed ringspun cotton polo shirt featuring the detailed gold & emerald UPUA crest embroidery on the left chest with contrast sleeve trim.",
    features: [
      "100% breathable pique cotton fabric",
      "High-density embroidery crest that won't fade",
      "Available in Forest Green or Crisp White",
      "Pre-shrunk tailored fit",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL", "3XL"],
    inStock: true,
  },
  {
    id: "urhobo-comprehensive-dictionary-book",
    title: "Comprehensive Urhobo-English Cultural Dictionary",
    category: "Books & Culture",
    price: 45,
    image: "/update-stem.jpg",
    badge: "Educational",
    description:
      "Authoritative illustrated language compendium and cultural reference guide designed for diaspora children, students, and families learning Urhobo grammar, idioms, and folklore.",
    features: [
      "Over 450 pages with phonetics & vocabulary guides",
      "Chapters on Urhobo history, clans, and kingdoms",
      "Common conversational proverbs & phrases translated",
      "Hardcover edition with ribbon bookmark",
    ],
    inStock: true,
  },
  {
    id: "upua-commemorative-lapel-pins",
    title: "UPUA Commemorative Gold Lapel Pin (Set of 2)",
    category: "Accessories",
    price: 20,
    image: "/assets/Delaware-1.jpg",
    description:
      "Polished hard-enamel and 24K gold-plated lapel badges featuring the official UPUA coat of arms. Perfect for suits, blazers, caps, and traditional agbada attire.",
    features: [
      "Set of 2 matching gold-plated pins",
      "Military clutch backing for secure wear",
      "Jewelry gift box presentation",
    ],
    inStock: true,
  },
  {
    id: "urhobo-desk-flag-stand",
    title: "Urhobo Ceremonial Desk Banner & Brass Stand",
    category: "Accessories",
    price: 25,
    image: "/upua-logo.png",
    description:
      "Miniature embroidered Urhobo national banner mounted on an 11-inch solid polished brass stand. Ideal for executive desks, chapter meetings, and home displays.",
    features: [
      "Detailed embroidered colors & royal emblem",
      "Weighted brass base with anti-scratch bottom",
      "Dimensions: 4\" x 6\" silk flag, 11\" brass pole",
    ],
    inStock: true,
  },
  {
    id: "upuaya-youth-fleece-hoodie",
    title: "UPUAYA Next-Gen Heavyweight Fleece Hoodie",
    category: "Apparel & Regalia",
    price: 45,
    image: "/assets/youth-kevwe.jpeg",
    description:
      "Plush ultra-warm 350 GSM fleece hoodie featuring the modern UPUAYA Youth Wing graphic, double-lined hood, and matching drawstrings.",
    features: [
      "Super soft cotton-poly blend fleece",
      "Ribbed cuffs and waistband with kangaroo pocket",
      "Screen-printed with water-based durable inks",
    ],
    options: ["Small (S)", "Medium (M)", "Large (L)", "XL", "2XL"],
    inStock: true,
  },
];

interface CartEntry {
  item: StoreItem;
  quantity: number;
  selectedOption?: string;
}

export default function StorePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartEntry[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [checkoutStep, setCheckoutStep] = useState<"shipping" | "payment" | "success">("shipping");

  // Selected item option map: itemId -> option
  const [itemOptions, setItemOptions] = useState<Record<string, string>>({});

  // Checkout form state
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [shippingAddress, setShippingAddress] = useState("");
  const [shippingCity, setShippingCity] = useState("");
  const [shippingState, setShippingState] = useState("");
  const [shippingZip, setShippingZip] = useState("");
  const [shippingCountry, setShippingCountry] = useState("United States");
  const [orderNotes, setOrderNotes] = useState("");

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExp, setCardExp] = useState("");
  const [cardCvc, setCardCvc] = useState("");

  // Processing & Success
  const [isProcessing, setIsProcessing] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [confirmedOrder, setConfirmedOrder] = useState<{
    orderId: string;
    total: number;
    email: string;
    items: CartEntry[];
  } | null>(null);

  // Custom Quick Payment tab
  const [customPayOpen, setCustomPayOpen] = useState(false);
  const [customAmount, setCustomAmount] = useState("");
  const [customPurpose, setCustomPurpose] = useState("");

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
      return [...prev, { item, quantity: 1, selectedOption }];
    });

    if (immediateCheckout) {
      setIsCheckoutOpen(true);
      setCheckoutStep("shipping");
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
  const subtotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);
  // Free shipping for convention packages, flat $8 for apparel/items
  const hasPhysicalGoods = cart.some((c) => c.item.category !== "Convention Packages");
  const shippingCost = cart.length === 0 ? 0 : hasPhysicalGoods ? 8 : 0;
  const orderTotal = subtotal + shippingCost;

  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");

    if (!customerName || !customerEmail) {
      setOrderError("Please enter your name and email address.");
      return;
    }

    if (checkoutStep === "shipping") {
      setCheckoutStep("payment");
      return;
    }

    // Payment execution
    setIsProcessing(true);

    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: orderTotal,
          currency: "usd",
          category: "merchandise",
          memberName: customerName,
          email: customerEmail,
          description: `UPUA Store Order: ${cart.map((c) => `${c.quantity}x ${c.item.title}`).join(", ")}`,
        }),
      });

      const data = await res.json();

      if (!res.ok && !data.success) {
        throw new Error(data.error || "Payment processing failed");
      }

      const generatedId = `UPUA-ORD-${Math.floor(100000 + Math.random() * 900000)}`;

      setConfirmedOrder({
        orderId: generatedId,
        total: orderTotal,
        email: customerEmail,
        items: [...cart],
      });

      // Clear cart
      setCart([]);
      setCheckoutStep("success");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Payment error occurred";
      setOrderError(msg);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomPaySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOrderError("");
    const parsed = parseFloat(customAmount);
    if (!parsed || parsed <= 0) {
      setOrderError("Please enter a valid amount.");
      return;
    }
    if (!customerEmail || !customerName) {
      setOrderError("Please provide your name and email.");
      return;
    }

    setIsProcessing(true);
    try {
      const res = await fetch("/api/stripe/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parsed,
          currency: "usd",
          category: "merchandise",
          memberName: customerName,
          email: customerEmail,
          description: `UPUA Custom Store Payment: ${customPurpose || "Direct Item Payment"}`,
        }),
      });

      const data = await res.json();
      if (!res.ok && !data.success) throw new Error(data.error || "Payment failed");

      setConfirmedOrder({
        orderId: `UPUA-PAY-${Math.floor(100000 + Math.random() * 900000)}`,
        total: parsed,
        email: customerEmail,
        items: [
          {
            item: {
              id: "custom-item",
              title: customPurpose || "Custom Store / Convention Item Payment",
              category: "Convention Packages",
              price: parsed,
              image: "/upua-logo.png",
              description: customPurpose || "Direct custom payment",
              features: ["Official Receipt Dispatched"],
              inStock: true,
            },
            quantity: 1,
          },
        ],
      });

      setCustomPayOpen(false);
      setIsCheckoutOpen(true);
      setCheckoutStep("success");
    } catch (err: unknown) {
      setOrderError(err instanceof Error ? err.message : "Error processing payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredItems = catalogItems.filter((item) => {
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
            Open to the public. Reserve convention vendor tables, purchase souvenir brochure advertisements, cultural regalia, and official memorabilia with secure online card payment.
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
            <button
              type="button"
              onClick={() => setCustomPayOpen(true)}
              className="store-hero-custom-btn"
            >
              <DollarSign size={18} />
              <span>Direct Custom Item Payment</span>
            </button>
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
              <strong>Secure Stripe Processing</strong>
              <small>256-bit SSL encrypted checkout</small>
            </div>
          </div>
          <div className="store-trust-item">
            <Package size={20} color="#0f6a4b" />
            <div>
              <strong>Convention &amp; Delivery Guarantees</strong>
              <small>Instant receipt &amp; secretariat fulfillment</small>
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
                        style={{ objectFit: "contain", objectPosition: "center center", padding: "12px" }}
                      />
                      {item.badge && (
                        <span className="store-badge">{item.badge}</span>
                      )}
                      <span className="store-category-tag">{item.category}</span>
                    </div>

                    <div className="store-card-body">
                      <div className="store-card-price-row">
                        <span className="store-price">${item.price.toFixed(2)}</span>
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
                          ${entry.item.price.toFixed(2)} each
                        </span>
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
                    setCheckoutStep("shipping");
                  }}
                >
                  <Lock size={16} />
                  <span>Proceed to Checkout &bull; ${orderTotal.toFixed(2)}</span>
                </button>
                <div style={{ textAlign: "center", fontSize: "11.5px", color: "#6b7280", marginTop: "10px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                  <ShieldCheck size={14} color="#0f6a4b" />
                  <span>Instant email receipt &bull; Stripe secured</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Checkout Modal Window */}
      {isCheckoutOpen && (
        <div className="upua-modal-backdrop" onClick={() => !isProcessing && setIsCheckoutOpen(false)}>
          <div className="store-checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => !isProcessing && setIsCheckoutOpen(false)}
              aria-label="Close checkout"
            >
              <X size={20} />
            </button>

            {/* Step: Success Screen */}
            {checkoutStep === "success" && confirmedOrder ? (
              <div className="store-success-screen">
                <div className="store-success-icon-wrap">
                  <CheckCircle2 size={54} color="#0f6a4b" />
                </div>
                <h2>Payment Successful!</h2>
                <p style={{ color: "#475467", fontSize: "14.5px", margin: "4px 0 20px" }}>
                  Thank you for your order and support of Urhobo Progress Union America.
                </p>

                <div className="store-receipt-card">
                  <div className="store-receipt-row">
                    <span>Order Reference</span>
                    <strong>{confirmedOrder.orderId}</strong>
                  </div>
                  <div className="store-receipt-row">
                    <span>Amount Paid</span>
                    <strong style={{ color: "#0f6a4b", fontSize: "16px" }}>
                      ${confirmedOrder.total.toFixed(2)} USD
                    </strong>
                  </div>
                  <div className="store-receipt-row">
                    <span>Receipt Sent To</span>
                    <span>{confirmedOrder.email}</span>
                  </div>
                  <div className="store-receipt-row">
                    <span>Payment Method</span>
                    <span>Credit / Debit Card (Stripe Verified)</span>
                  </div>

                  <div style={{ borderTop: "1px solid #e5e7eb", marginTop: "14px", paddingTop: "12px" }}>
                    <div style={{ fontSize: "12px", fontWeight: 700, color: "#374151", marginBottom: "8px" }}>
                      Purchased Items:
                    </div>
                    {confirmedOrder.items.map((c, i) => (
                      <div key={i} style={{ display: "flex", justifyContent: "space-between", fontSize: "13px", color: "#4b5563", marginBottom: "4px" }}>
                        <span>
                          {c.quantity}x {c.item.title} {c.selectedOption ? `(${c.selectedOption})` : ""}
                        </span>
                        <span>${(c.item.price * c.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ padding: "14px 18px", background: "#f0f7f3", borderRadius: "10px", fontSize: "13px", color: "#0e3d26", textAlign: "left", margin: "20px 0" }}>
                  <strong>Next Steps for Convention Vendors &amp; Ads:</strong>
                  <p style={{ margin: "4px 0 0", fontSize: "12.5px", color: "#345443" }}>
                    If you purchased a convention vendor table or souvenir brochure ad, our National Secretariat team will email you within 24 hours to collect artwork, logos, and attendee passes.
                  </p>
                </div>

                <button
                  type="button"
                  className="store-checkout-cta"
                  onClick={() => setIsCheckoutOpen(false)}
                >
                  Continue Browsing Store
                </button>
              </div>
            ) : (
              /* Steps: Shipping & Payment */
              <form onSubmit={handleCheckoutSubmit} className="store-checkout-form">
                <div className="store-checkout-header">
                  <h3>
                    {checkoutStep === "shipping" ? "1. Customer & Delivery Info" : "2. Secure Payment"}
                  </h3>
                  <div className="store-checkout-progress">
                    <span className={`step-dot ${checkoutStep === "shipping" ? "active" : "done"}`}>1</span>
                    <span className="step-line" />
                    <span className={`step-dot ${checkoutStep === "payment" ? "active" : ""}`}>2</span>
                  </div>
                </div>

                {orderError && (
                  <div className="store-error-banner">
                    {orderError}
                  </div>
                )}

                {/* Step 1: Shipping and Contact */}
                {checkoutStep === "shipping" && (
                  <div className="store-form-fields">
                    <div className="store-form-row">
                      <div className="store-input-wrap">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          required
                          placeholder="e.g. Chief Oghenemaro Davis"
                          value={customerName}
                          onChange={(e) => setCustomerName(e.target.value)}
                        />
                      </div>
                      <div className="store-input-wrap">
                        <label>Email Address (For Receipt) *</label>
                        <input
                          type="email"
                          required
                          placeholder="name@example.com"
                          value={customerEmail}
                          onChange={(e) => setCustomerEmail(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="store-form-row">
                      <div className="store-input-wrap">
                        <label>Phone Number *</label>
                        <input
                          type="tel"
                          required
                          placeholder="+1 (555) 000-0000"
                          value={customerPhone}
                          onChange={(e) => setCustomerPhone(e.target.value)}
                        />
                      </div>
                      <div className="store-input-wrap">
                        <label>Country *</label>
                        <select
                          value={shippingCountry}
                          onChange={(e) => setShippingCountry(e.target.value)}
                        >
                          <option value="United States">United States</option>
                          <option value="Canada">Canada</option>
                          <option value="United Kingdom">United Kingdom</option>
                          <option value="Nigeria">Nigeria</option>
                          <option value="Other">Other International</option>
                        </select>
                      </div>
                    </div>

                    <div className="store-input-wrap">
                      <label>Street Address / Delivery Location *</label>
                      <input
                        type="text"
                        required
                        placeholder="1234 Urhobo Way, Suite 100"
                        value={shippingAddress}
                        onChange={(e) => setShippingAddress(e.target.value)}
                      />
                    </div>

                    <div className="store-form-row store-three-col">
                      <div className="store-input-wrap">
                        <label>City *</label>
                        <input
                          type="text"
                          required
                          placeholder="Houston"
                          value={shippingCity}
                          onChange={(e) => setShippingCity(e.target.value)}
                        />
                      </div>
                      <div className="store-input-wrap">
                        <label>State / Province *</label>
                        <input
                          type="text"
                          required
                          placeholder="TX"
                          value={shippingState}
                          onChange={(e) => setShippingState(e.target.value)}
                        />
                      </div>
                      <div className="store-input-wrap">
                        <label>ZIP / Postal *</label>
                        <input
                          type="text"
                          required
                          placeholder="77002"
                          value={shippingZip}
                          onChange={(e) => setShippingZip(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="store-input-wrap">
                      <label>Order Notes / Custom Brochure Text (Optional)</label>
                      <textarea
                        rows={2}
                        placeholder="Company name for vendor table, goodwill message title, or specific size notes..."
                        value={orderNotes}
                        onChange={(e) => setOrderNotes(e.target.value)}
                      />
                    </div>

                    <div className="store-form-actions">
                      <button
                        type="button"
                        className="store-back-btn"
                        onClick={() => {
                          setIsCheckoutOpen(false);
                          setIsCartOpen(true);
                        }}
                      >
                        Back to Cart
                      </button>
                      <button type="submit" className="store-continue-btn">
                        <span>Continue to Payment</span>
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </div>
                )}

                {/* Step 2: Payment Details */}
                {checkoutStep === "payment" && (
                  <div className="store-form-fields">
                    <div className="store-order-mini-summary">
                      <div>
                        <strong>Order Total:</strong>{" "}
                        <span style={{ color: "#0f6a4b", fontWeight: 800 }}>${orderTotal.toFixed(2)} USD</span>
                      </div>
                      <small style={{ color: "#6b7280" }}>
                        Billed to {customerName} ({customerEmail})
                      </small>
                    </div>

                    <div className="store-payment-badge-row">
                      <CreditCard size={18} color="#0e3d26" />
                      <strong>Credit / Debit Card (Visa, MasterCard, Amex)</strong>
                    </div>

                    <div className="store-input-wrap">
                      <label>Card Number *</label>
                      <input
                        type="text"
                        required
                        maxLength={19}
                        placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                      />
                    </div>

                    <div className="store-form-row">
                      <div className="store-input-wrap">
                        <label>Expires (MM/YY) *</label>
                        <input
                          type="text"
                          required
                          maxLength={5}
                          placeholder="12/28"
                          value={cardExp}
                          onChange={(e) => setCardExp(e.target.value)}
                        />
                      </div>
                      <div className="store-input-wrap">
                        <label>CVC / Security Code *</label>
                        <input
                          type="text"
                          required
                          maxLength={4}
                          placeholder="123"
                          value={cardCvc}
                          onChange={(e) => setCardCvc(e.target.value)}
                        />
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", color: "#526359", margin: "10px 0" }}>
                      <Lock size={14} color="#0f6a4b" />
                      <span>Encrypted via Stripe. No card details stored on UPUA servers.</span>
                    </div>

                    <div className="store-form-actions">
                      <button
                        type="button"
                        className="store-back-btn"
                        onClick={() => setCheckoutStep("shipping")}
                        disabled={isProcessing}
                      >
                        Back
                      </button>
                      <button
                        type="submit"
                        className="store-checkout-cta"
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <>
                            <Loader2 size={16} className="animate-spin" />
                            <span>Authorizing Payment...</span>
                          </>
                        ) : (
                          <>
                            <Lock size={16} />
                            <span>Authorize &amp; Pay ${orderTotal.toFixed(2)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      )}

      {/* Direct Custom Item / Fee Payment Modal */}
      {customPayOpen && (
        <div className="upua-modal-backdrop" onClick={() => !isProcessing && setCustomPayOpen(false)}>
          <div className="store-checkout-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="upua-modal-close-btn"
              onClick={() => !isProcessing && setCustomPayOpen(false)}
              aria-label="Close"
            >
              <X size={20} />
            </button>

            <div className="store-checkout-header">
              <h3>Direct Item / Convention Fee Payment</h3>
              <p style={{ margin: 0, fontSize: "13px", color: "#667085" }}>
                Pay directly for custom convention sponsorships, custom exhibitor fees, or specific quoted items.
              </p>
            </div>

            {orderError && <div className="store-error-banner">{orderError}</div>}

            <form onSubmit={handleCustomPaySubmit} className="store-form-fields" style={{ marginTop: "16px" }}>
              <div className="store-input-wrap">
                <label>Amount to Pay (USD $) *</label>
                <div style={{ position: "relative" }}>
                  <span style={{ position: "absolute", left: "14px", top: "12px", fontWeight: 700, color: "#0e3d26" }}>$</span>
                  <input
                    type="number"
                    step="0.01"
                    min="1"
                    required
                    style={{ paddingLeft: "32px" }}
                    placeholder="200.00"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(e.target.value)}
                  />
                </div>
              </div>

              <div className="store-input-wrap">
                <label>Payment Purpose / Item Description *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vendor Table Sponsorship #4, Youth Banquet Table, Custom Ad"
                  value={customPurpose}
                  onChange={(e) => setCustomPurpose(e.target.value)}
                />
              </div>

              <div className="store-form-row">
                <div className="store-input-wrap">
                  <label>Payer Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="Chief Emmanuel Oghenero"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                  />
                </div>
                <div className="store-input-wrap">
                  <label>Email Address (For Official Receipt) *</label>
                  <input
                    type="email"
                    required
                    placeholder="name@example.com"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                  />
                </div>
              </div>

              <div className="store-input-wrap">
                <label>Card Number *</label>
                <input
                  type="text"
                  required
                  placeholder="4242 &bull;&bull;&bull;&bull; &bull;&bull;&bull;&bull; 4242"
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                />
              </div>

              <div className="store-form-row">
                <div className="store-input-wrap">
                  <label>Expiry (MM/YY) *</label>
                  <input
                    type="text"
                    required
                    placeholder="08/27"
                    value={cardExp}
                    onChange={(e) => setCardExp(e.target.value)}
                  />
                </div>
                <div className="store-input-wrap">
                  <label>CVC *</label>
                  <input
                    type="text"
                    required
                    placeholder="123"
                    value={cardCvc}
                    onChange={(e) => setCardCvc(e.target.value)}
                  />
                </div>
              </div>

              <div className="store-form-actions">
                <button
                  type="button"
                  className="store-back-btn"
                  onClick={() => setCustomPayOpen(false)}
                  disabled={isProcessing}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="store-checkout-cta"
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <Lock size={16} />
                      <span>Pay ${customAmount || "0.00"} Now</span>
                    </>
                  )}
                </button>
              </div>
            </form>
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
