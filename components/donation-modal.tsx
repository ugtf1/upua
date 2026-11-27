"use client";

import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
  defaultAmount?: number;
}

export function openDonationModal(options?: { amount?: number; program?: string }) {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("open-donation-modal", { detail: options }));
  }
}

export default function DonationModal({ isOpen: propsIsOpen, onClose }: DonationModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = propsIsOpen || internalOpen;

  useEffect(() => {
    const open = () => setInternalOpen(true);
    window.addEventListener("open-donation-modal", open);
    return () => window.removeEventListener("open-donation-modal", open);
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
    <div className="upua-modal-backdrop" onClick={close} role="dialog" aria-modal="true" aria-label="Donations">
      <div className="upua-donation-modal-box" onClick={(event) => event.stopPropagation()}>
        <button type="button" className="upua-modal-close-btn" onClick={close} aria-label="Close donation modal"><X size={18} /></button>
        <div className="donation-modal-content" style={{ padding: "28px" }}>
          <h2>Donations</h2>
          <p>Online donations through this form are not available yet. No donation has been submitted.</p>
          <button type="button" className="btn-primary" onClick={close}>Close</button>
        </div>
      </div>
    </div>
  );
}
