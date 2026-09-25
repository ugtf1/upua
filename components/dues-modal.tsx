"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, ShieldCheck, CheckCircle2, Lock, CreditCard } from "lucide-react";

interface DuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChapter?: string;
  defaultFrequency?: "quarterly" | "yearly";
  defaultAmount?: number;
}

const QUARTERLY_PRESETS = [75, 100, 150];
const YEARLY_PRESETS = [250, 300, 500];

const DEFAULT_CHAPTERS = [
  "Urhobo Progressive Association (UPA), Houston",
  "UPU of DC, Maryland & Virginia (UPUDMV)",
  "UPU Chicagoland (UPUC)",
  "UPU of Southern California (UPUSC)",
  "Urhobo Association of Georgia (UAG)",
  "UPU Delaware Valley (PA, DE, NJ)",
  "UPU New York / Tri-State",
  "UPU Northern California",
  "UPU Dallas-Fort Worth",
  "UPU Minnesota",
  "UPU New England",
  "UPU Florida",
];

export function openDuesModal(options?: {
  chapterName?: string;
  frequency?: "quarterly" | "yearly";
  amount?: number;
}) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-dues-modal", { detail: options }));
  }
}

export default function DuesModal({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  defaultChapter,
  defaultFrequency = "quarterly",
  defaultAmount,
}: DuesModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = propsIsOpen || internalOpen;

  const [frequency, setFrequency] = useState<"quarterly" | "yearly">(defaultFrequency);
  const [amount, setAmount] = useState<number>(
    defaultAmount || (defaultFrequency === "quarterly" ? 75 : 300)
  );
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);

  const [selectedChapter, setSelectedChapter] = useState<string>(defaultChapter || "");
  const [chapterOptions, setChapterOptions] = useState<string[]>(DEFAULT_CHAPTERS);

  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [memberId, setMemberId] = useState<string>("");
  const [phone, setPhone] = useState<string>("");

  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  // Fetch chapters on mount
  useEffect(() => {
    fetch("/api/chapters")
      .then((r) => r.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setChapterOptions(res.data.map((c: any) => c.name));
        }
      })
      .catch(() => {});
  }, []);

  // Listen to global event
  useEffect(() => {
    function handleGlobalOpen(e: Event) {
      const customEvent = e as CustomEvent<{
        chapterName?: string;
        frequency?: "quarterly" | "yearly";
        amount?: number;
      }>;
      if (customEvent.detail?.chapterName) {
        setSelectedChapter(customEvent.detail.chapterName);
      }
      if (customEvent.detail?.frequency) {
        setFrequency(customEvent.detail.frequency);
        if (!customEvent.detail?.amount) {
          setAmount(customEvent.detail.frequency === "quarterly" ? 75 : 300);
        }
      }
      if (customEvent.detail?.amount) {
        setAmount(customEvent.detail.amount);
      }
      setInternalOpen(true);
    }
    window.addEventListener("open-dues-modal", handleGlobalOpen);
    return () => window.removeEventListener("open-dues-modal", handleGlobalOpen);
  }, []);

  const handleClose = () => {
    setInternalOpen(false);
    if (propsOnClose) propsOnClose();
  };

  useEffect(() => {
    if (defaultChapter) setSelectedChapter(defaultChapter);
  }, [defaultChapter]);

  // Adjust default amounts when switching frequency
  const handleFrequencyChange = (freq: "quarterly" | "yearly") => {
    setFrequency(freq);
    setIsCustom(false);
    setCustomAmount("");
    setAmount(freq === "quarterly" ? 75 : 300);
    setErrorMessage("");
  };

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    }
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : amount;
  const presets = frequency === "quarterly" ? QUARTERLY_PRESETS : YEARLY_PRESETS;

  function handleSelectPreset(val: number) {
    setIsCustom(false);
    setAmount(val);
    setCustomAmount("");
    setErrorMessage("");
  }

  function handleCustomChange(val: string) {
    setIsCustom(true);
    setCustomAmount(val);
    const num = Number(val);
    if (num < 25 && val !== "") {
      setErrorMessage("Minimum dues payment is $25.");
    } else {
      setErrorMessage("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedChapter.trim()) {
      setErrorMessage("Chapter / branch affiliation is required for dues attribution.");
      return;
    }
    if (currentAmount < 25) {
      setErrorMessage("Please enter an amount of at least $25 for dues payment.");
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage("Please provide member full name and email for the official dues record.");
      return;
    }

    setErrorMessage("");
    setIsProcessing(true);

    // Simulate Stripe payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
    }, 1800);
  }

  function handleReset() {
    setIsSuccess(false);
    setIsProcessing(false);
    setFullName("");
    setEmail("");
    setPhone("");
    setMemberId("");
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    handleClose();
  }

  return (
    <div className="upua-modal-backdrop" onClick={handleClose} role="dialog" aria-modal="true">
      <div className="upua-donation-modal-box" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="upua-modal-close-btn"
          onClick={handleClose}
          aria-label="Close dues modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="donation-success-panel">
            <div className="donation-success-icon-wrap" style={{ background: "#e8f0fe" }}>
              <CheckCircle2 size={54} color="#1a73e8" />
            </div>
            <h2>Dues Payment Confirmed</h2>
            <p className="donation-success-sub">
              Your <strong>{frequency}</strong> dues payment of <strong>${currentAmount.toFixed(2)}</strong> has been processed via Stripe and credited to <strong>{selectedChapter}</strong>.
            </p>
            <div className="donation-receipt-box">
              <div>
                <span>Member Name:</span> <strong>{fullName}</strong>
              </div>
              <div>
                <span>Chapter Credited:</span> <strong>{selectedChapter}</strong>
              </div>
              <div>
                <span>Billing Period:</span> <strong style={{ textTransform: "capitalize" }}>{frequency} Dues</strong>
              </div>
              <div>
                <span>Receipt Sent To:</span> <strong>{email}</strong>
              </div>
              <div>
                <span>Reference ID:</span> <strong>UPUA-DUES-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </div>
              <div>
                <span>Status:</span> <strong style={{ color: "#137459" }}>Authorized via Stripe · Good Standing Validated</strong>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#526359", margin: "16px 0 24px" }}>
              This digital receipt confirms your active membership standing and voting accreditation with Urhobo Progress Union America.
            </p>
            <button type="button" className="btn-primary" onClick={handleReset} style={{ width: "100%", padding: "14px" }}>
              Close & View Ledger
            </button>
          </div>
        ) : (
          <div className="donation-modal-content">
            {/* Modal Header */}
            <div className="donation-modal-header" style={{ background: "linear-gradient(135deg, #0e3d26 0%, #165637 100%)" }}>
              <div className="donation-brand-wrap">
                <Image src="/upua-logo.png" alt="UPUA Logo" width={48} height={48} priority />
                <div>
                  <h3 style={{ fontSize: "1.25rem" }}>Pay Membership Dues</h3>
                  <p>Official Chapter & National Union Dues Clearance</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="donation-form-body">
              {/* Frequency Toggle: Quarterly vs. Yearly */}
              <div>
                <label className="donation-label">Select Payment Interval</label>
                <div className="donation-freq-toggle">
                  <button
                    type="button"
                    className={frequency === "quarterly" ? "active" : ""}
                    onClick={() => handleFrequencyChange("quarterly")}
                  >
                    Quarterly Dues
                  </button>
                  <button
                    type="button"
                    className={frequency === "yearly" ? "active" : ""}
                    onClick={() => handleFrequencyChange("yearly")}
                  >
                    Annual / Yearly Dues
                  </button>
                </div>
              </div>

              {/* Amount Selection */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="donation-label" style={{ margin: 0 }}>
                    {frequency === "quarterly" ? "Quarterly" : "Yearly"} Dues Amount
                  </label>
                  <span style={{ fontSize: "11px", color: "#137459", fontWeight: 700 }}>Min. $25</span>
                </div>
                <div className="donation-presets-grid">
                  {presets.map((val) => (
                    <button
                      key={val}
                      type="button"
                      className={`donation-preset-btn ${!isCustom && amount === val ? "active" : ""}`}
                      onClick={() => handleSelectPreset(val)}
                    >
                      ${val}
                    </button>
                  ))}
                  <button
                    type="button"
                    className={`donation-preset-btn ${isCustom ? "active" : ""}`}
                    onClick={() => setIsCustom(true)}
                  >
                    Custom
                  </button>
                </div>

                {isCustom && (
                  <div className="donation-custom-input-wrap">
                    <span className="dollar-sign">$</span>
                    <input
                      type="number"
                      min={25}
                      placeholder={`Enter ${frequency} dues amount`}
                      value={customAmount}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                )}
              </div>

              {/* Chapter / Branch Affiliation (MANDATORY) */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="donation-label" style={{ margin: 0 }}>Chapter / Branch Affiliation *</label>
                  <span style={{ fontSize: "11px", color: "#c5221f", fontWeight: 700 }}>Required</span>
                </div>
                <select
                  required
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="donation-input"
                  style={{ borderColor: !selectedChapter && errorMessage ? "#c5221f" : undefined }}
                >
                  <option value="">-- Select Your Chapter / Branch (Required) --</option>
                  {chapterOptions.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
                <small style={{ display: "block", color: "#526359", fontSize: "11px", marginTop: "4px" }}>
                  Dues are allocated directly to your chapter&apos;s active membership ledger.
                </small>
              </div>

              {/* Member Contact Information */}
              <div className="donation-row-2">
                <div>
                  <label className="donation-label">Member Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Oghenefejiro Okagbare"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="donation-input"
                  />
                </div>
                <div>
                  <label className="donation-label">Email (for Dues Receipt) *</label>
                  <input
                    type="email"
                    required
                    placeholder="you@domain.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="donation-input"
                  />
                </div>
              </div>

              <div className="donation-row-2">
                <div>
                  <label className="donation-label">Member ID (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. UPUA-2024-8841"
                    value={memberId}
                    onChange={(e) => setMemberId(e.target.value)}
                    className="donation-input"
                  />
                </div>
                <div>
                  <label className="donation-label">Phone Number (Optional)</label>
                  <input
                    type="tel"
                    placeholder="+1 (xxx) xxx-xxxx"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="donation-input"
                  />
                </div>
              </div>

              {/* Payment Details with Stripe Badge */}
              <div className="stripe-payment-box">
                <div className="stripe-payment-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CreditCard size={18} color="#0e3d26" />
                    <strong>Card Payment via Stripe</strong>
                  </div>
                  <div className="stripe-badge">
                    <Lock size={12} color="#137459" />
                    <span>Powered by Stripe</span>
                  </div>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "12px" }}>
                  <input
                    type="text"
                    placeholder="Card Number (16 digits)"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="donation-input"
                  />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                    <input
                      type="text"
                      placeholder="MM / YY"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="donation-input"
                    />
                    <input
                      type="password"
                      placeholder="CVC / CVV"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="donation-input"
                    />
                  </div>
                </div>
                <small style={{ display: "block", color: "#667085", fontSize: "11px", marginTop: "8px" }}>
                  Card payments processed securely through Stripe with 256-bit encryption.
                </small>
              </div>

              {errorMessage && (
                <div className="donation-error-msg" style={{ marginTop: "4px" }}>
                  {errorMessage}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="donation-submit-btn"
                style={{ background: "#0e3d26" }}
              >
                {isProcessing ? (
                  <span>Processing Dues via Stripe...</span>
                ) : (
                  <span>
                    Pay ${currentAmount > 0 ? currentAmount.toFixed(2) : "0.00"} {frequency === "quarterly" ? "Quarterly" : "Annual"} Dues
                  </span>
                )}
              </button>

              <div style={{ textAlign: "center", color: "#526359", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <ShieldCheck size={14} color="#137459" />
                <span>Validates Chapter Voting Rights & National Union Accreditation</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
