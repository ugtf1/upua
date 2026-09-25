"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { X, Heart, Shield, CheckCircle2, Lock, CreditCard, Sparkles } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
  defaultAmount?: number;
}

const PRESET_AMOUNTS = [50, 100, 250, 500, 1000];

const PROGRAMS = [
  "General Community Fund",
  "Women in Shelter Initiative",
  "STEM & AI Training in Urhoboland",
  "Medical Outreach & Health Missions",
  "Humanitarian Relief for Okuama IDPs",
  "UPUA Scholarship Trust Fund",
  "Cultural & Language Preservation",
];

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

export function openDonationModal(options?: { amount?: number; program?: string }) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-donation-modal", { detail: options }));
  }
}

export default function DonationModal({
  isOpen: propsIsOpen,
  onClose: propsOnClose,
  defaultProgram,
  defaultAmount = 50,
}: DonationModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = propsIsOpen || internalOpen;

  const [amount, setAmount] = useState<number>(Math.max(50, defaultAmount));
  const [customAmount, setCustomAmount] = useState<string>("");
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [frequency, setFrequency] = useState<"one-time" | "monthly">("one-time");
  const [program, setProgram] = useState<string>(defaultProgram || PROGRAMS[0]);
  const [selectedChapter, setSelectedChapter] = useState<string>("");
  const [chapterOptions, setChapterOptions] = useState<string[]>(DEFAULT_CHAPTERS);
  const [fullName, setFullName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [cardNumber, setCardNumber] = useState<string>("");
  const [cardExpiry, setCardExpiry] = useState<string>("");
  const [cardCvc, setCardCvc] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

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

  useEffect(() => {
    function handleGlobalOpen(e: Event) {
      const customEvent = e as CustomEvent<{ amount?: number; program?: string }>;
      if (customEvent.detail?.amount) {
        setAmount(Math.max(50, customEvent.detail.amount));
      }
      if (customEvent.detail?.program) {
        setProgram(customEvent.detail.program);
      }
      setInternalOpen(true);
    }
    window.addEventListener("open-donation-modal", handleGlobalOpen);
    return () => window.removeEventListener("open-donation-modal", handleGlobalOpen);
  }, []);

  const handleClose = () => {
    setInternalOpen(false);
    if (propsOnClose) propsOnClose();
  };

  useEffect(() => {
    if (defaultProgram) setProgram(defaultProgram);
    if (defaultAmount) {
      const amt = Math.max(50, defaultAmount);
      setAmount(amt);
      if (!PRESET_AMOUNTS.includes(amt)) {
        setIsCustom(true);
        setCustomAmount(amt.toString());
      }
    }
  }, [defaultProgram, defaultAmount]);

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
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const currentAmount = isCustom ? Number(customAmount) || 0 : amount;

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
    if (num < 50 && val !== "") {
      setErrorMessage("Minimum donation amount is $50.");
    } else {
      setErrorMessage("");
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (currentAmount < 50) {
      setErrorMessage("Please enter an amount of at least $50. Thank you for your support!");
      return;
    }
    if (!fullName.trim() || !email.trim()) {
      setErrorMessage("Please provide your full name and email address for the tax receipt.");
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
    setSelectedChapter("");
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
          aria-label="Close donation modal"
        >
          <X size={18} />
        </button>

        {isSuccess ? (
          <div className="donation-success-panel">
            <div className="donation-success-icon-wrap">
              <CheckCircle2 size={54} color="#137459" />
            </div>
            <h2>Thank You for Your Generosity!</h2>
            <p className="donation-success-sub">
              Your contribution of <strong>${currentAmount}</strong> ({frequency}) towards{" "}
              <strong>{program}</strong> empowers Urhobo communities and transforms lives.
            </p>
            <div className="donation-receipt-box">
              <div>
                <span>Donor:</span> <strong>{fullName}</strong>
              </div>
              <div>
                <span>Receipt sent to:</span> <strong>{email}</strong>
              </div>
              {selectedChapter && (
                <div>
                  <span>Chapter Credited:</span> <strong>{selectedChapter}</strong>
                </div>
              )}
              <div>
                <span>Reference ID:</span> <strong>UPUA-ST-{Math.floor(100000 + Math.random() * 900000)}</strong>
              </div>
              <div>
                <span>Status:</span> <strong style={{ color: "#137459" }}>Authorized via Stripe</strong>
              </div>
            </div>
            <p style={{ fontSize: "13px", color: "#526359", margin: "16px 0 24px" }}>
              Urhobo Progress Union America is a registered 501(c)(3) non-profit organization. A formal tax receipt has been emailed to you.
            </p>
            <button type="button" className="btn-primary" onClick={handleReset} style={{ width: "100%", padding: "14px" }}>
              Return to Website
            </button>
          </div>
        ) : (
          <div className="donation-modal-content">
            {/* Modal Header */}
            <div className="donation-modal-header">
              <div className="donation-brand-wrap">
                <Image src="/upua-logo.png" alt="UPUA Logo" width={48} height={48} priority />
                <div>
                  <h3>Support UPU America</h3>
                  <p>Advancing education, health & community progress</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="donation-form-body">
              {/* Frequency Toggle */}
              <div className="donation-freq-toggle">
                <button
                  type="button"
                  className={frequency === "one-time" ? "active" : ""}
                  onClick={() => setFrequency("one-time")}
                >
                  One-Time Gift
                </button>
                <button
                  type="button"
                  className={frequency === "monthly" ? "active" : ""}
                  onClick={() => setFrequency("monthly")}
                >
                  Monthly Partner
                </button>
              </div>

              {/* Amount Selection */}
              <div>
                <label className="donation-label">Select Amount (Min. $50)</label>
                <div className="donation-presets-grid">
                  {PRESET_AMOUNTS.map((val) => (
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
                      min={50}
                      placeholder="Enter amount (min $50)"
                      value={customAmount}
                      onChange={(e) => handleCustomChange(e.target.value)}
                      required
                      autoFocus
                    />
                  </div>
                )}
                {errorMessage && <div className="donation-error-msg">{errorMessage}</div>}
              </div>

              {/* Program Designation */}
              <div>
                <label className="donation-label">Designate Your Gift</label>
                <select
                  value={program}
                  onChange={(e) => setProgram(e.target.value)}
                  className="donation-input"
                >
                  {PROGRAMS.map((prog) => (
                    <option key={prog} value={prog}>
                      {prog}
                    </option>
                  ))}
                </select>
              </div>

              {/* Chapter Affiliation (Optional) */}
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "6px" }}>
                  <label className="donation-label" style={{ margin: 0 }}>Chapter Affiliation</label>
                  <span style={{ fontSize: "11px", color: "#667085", fontWeight: 600 }}>Optional</span>
                </div>
                <select
                  value={selectedChapter}
                  onChange={(e) => setSelectedChapter(e.target.value)}
                  className="donation-input"
                >
                  <option value="">-- No Specific Chapter / General Contributor --</option>
                  {chapterOptions.map((ch) => (
                    <option key={ch} value={ch}>
                      {ch}
                    </option>
                  ))}
                </select>
                <small style={{ display: "block", color: "#667085", fontSize: "11px", marginTop: "4px" }}>
                  Crediting your contribution helps your chapter meet its annual fundraising target.
                </small>
              </div>

              {/* Donor Information */}
              <div className="donation-row-2">
                <div>
                  <label className="donation-label">Full Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Chief John Efe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="donation-input"
                  />
                </div>
                <div>
                  <label className="donation-label">Email Address (for tax receipt) *</label>
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

              {/* Payment Details with Stripe Badge */}
              <div className="stripe-payment-box">
                <div className="stripe-payment-header">
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <CreditCard size={18} color="#0e3d26" />
                    <strong>Credit or Debit Card</strong>
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
                  Payments will be processed through Stripe. SSL 256-bit encrypted & secure.
                </small>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="donation-submit-btn"
              >
                {isProcessing ? (
                  <span>Processing Payment via Stripe...</span>
                ) : (
                  <span>
                    Donate ${currentAmount > 0 ? currentAmount : 50} {frequency === "monthly" ? "/ month" : "Now"}
                  </span>
                )}
              </button>

              <div style={{ textAlign: "center", color: "#526359", fontSize: "12px", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
                <Shield size={14} color="#137459" />
                <span>Tax-deductible 501(c)(3) contribution · Minimum donation $50</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
