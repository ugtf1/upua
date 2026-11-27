"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DuesModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultChapter?: string;
  defaultFrequency?: "quarterly" | "yearly";
  defaultAmount?: number;
}

export function openDuesModal(options?: { chapterName?: string; frequency?: "quarterly" | "yearly"; amount?: number }) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-dues-modal", { detail: options }));
  }
}

export default function DuesModal({ isOpen: propsIsOpen, onClose }: DuesModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = propsIsOpen || internalOpen;

  useEffect(() => {
    const open = () => setInternalOpen(true);
    window.addEventListener("open-dues-modal", open);
    return () => window.removeEventListener("open-dues-modal", open);
  }, []);

  const close = () => { setInternalOpen(false); onClose(); };
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") { setInternalOpen(false); onClose(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  if (!isOpen) return null;
  return (
    <div className="upua-modal-backdrop" onClick={close} role="dialog" aria-modal="true" aria-label="Dues payments">
      <div className="upua-donation-modal-box" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="upua-modal-close-btn" onClick={close} aria-label="Close dues modal"><X size={18} /></button>
        <div className="donation-modal-content" style={{ padding: "28px" }}>
          <h2>Dues payments</h2>
          <p>Dues payments are not available through this form. Please use your existing QuickBooks invoice; no payment has been submitted here.</p>
          <button type="button" className="btn-primary" onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
}
