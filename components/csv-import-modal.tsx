"use client";

import React, { useState, useRef } from "react";
import {
  Upload,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  X,
  Loader2,
  RefreshCw,
  Info,
  Check,
} from "lucide-react";

export type ImportType = "members" | "payments" | "expenses" | "chapters";

interface CSVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess?: () => void;
  initialType?: ImportType;
}

export default function CSVImportModal({
  isOpen,
  onClose,
  onImportSuccess,
  initialType = "members",
}: CSVImportModalProps) {
  const [importType, setImportType] = useState<ImportType>(initialType);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setResult(null);
      setError(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.name.endsWith(".csv") || file.type === "text/csv") {
        setSelectedFile(file);
        setResult(null);
        setError(null);
      } else {
        setError("Please drop a valid .csv file.");
      }
    }
  };

  const handleDownloadTemplate = () => {
    window.open(`/api/admin/import/template?type=${importType}`, "_blank");
  };

  const executeImport = async (dryRun: boolean) => {
    if (!selectedFile) {
      setError("Please select a CSV file first.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("type", importType);
      formData.append("dryRun", dryRun ? "true" : "false");

      const res = await fetch("/api/admin/import", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok || data.success === false) {
        setError(data.error || "Failed to process CSV file.");
      } else {
        setResult(data);
        if (!dryRun && onImportSuccess) {
          onImportSuccess();
        }
      }
    } catch (err: any) {
      setError(err.message || "Network error occurred during import.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
      <div className="relative w-full max-w-2xl rounded-2xl border border-gray-100 bg-white shadow-2xl">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
              <FileSpreadsheet className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Import Data via CSV</h3>
              <p className="text-xs text-gray-500">Bulk upload members, payments, expenses, or chapters</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="max-h-[75vh] overflow-y-auto p-6 space-y-6">
          {/* Step 1: Select Type */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              1. Select Data Type to Import
            </label>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { id: "members", label: "Members", icon: "👥" },
                { id: "payments", label: "Payments", icon: "💳" },
                { id: "expenses", label: "Expenses", icon: "💸" },
                { id: "chapters", label: "Chapters", icon: "🏛️" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setImportType(item.id as ImportType);
                    setResult(null);
                  }}
                  className={`flex flex-col items-center justify-center rounded-xl border p-3 text-center transition ${
                    importType === item.id
                      ? "border-amber-600 bg-amber-50/50 text-amber-900 ring-2 ring-amber-600/20 font-semibold"
                      : "border-gray-200 bg-white text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <span className="text-xl mb-1">{item.icon}</span>
                  <span className="text-xs">{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2: Download Template */}
          <div className="flex items-center justify-between rounded-xl bg-blue-50/60 border border-blue-100 p-4">
            <div className="flex items-center space-x-3">
              <Info className="h-5 w-5 text-blue-600 shrink-0" />
              <div className="text-xs text-blue-900">
                <span className="font-semibold">Need the format?</span> Download the pre-formatted CSV template.
              </div>
            </div>
            <button
              type="button"
              onClick={handleDownloadTemplate}
              className="inline-flex items-center space-x-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm border border-blue-200 hover:bg-blue-50 transition"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Download Template</span>
            </button>
          </div>

          {/* Step 3: File Upload Area */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-600 mb-2">
              2. Upload CSV File
            </label>
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 text-center cursor-pointer transition ${
                isDragging
                  ? "border-amber-600 bg-amber-50"
                  : selectedFile
                  ? "border-emerald-500 bg-emerald-50/30"
                  : "border-gray-200 bg-gray-50/50 hover:bg-gray-50"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleFileChange}
                className="hidden"
              />
              {selectedFile ? (
                <div className="space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                    <Check className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-bold text-gray-900">{selectedFile.name}</div>
                  <div className="text-xs text-gray-500">
                    {(selectedFile.size / 1024).toFixed(1)} KB • Click or drop to replace
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100 text-amber-600">
                    <Upload className="h-6 w-6" />
                  </div>
                  <div className="text-sm font-semibold text-gray-800">
                    Click to browse or drag and drop your CSV
                  </div>
                  <p className="text-xs text-gray-400">Supports standard UTF-8 encoded .csv files</p>
                </div>
              )}
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="flex items-start space-x-3 rounded-xl bg-rose-50 border border-rose-200 p-4 text-xs text-rose-800">
              <AlertTriangle className="h-5 w-5 text-rose-600 shrink-0 mt-0.5" />
              <div className="flex-1">
                <p className="font-semibold">Import Error</p>
                <p className="mt-0.5">{error}</p>
              </div>
            </div>
          )}

          {/* Validation / Execution Results */}
          {result && (
            <div className="space-y-4 rounded-xl border border-gray-200 bg-gray-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {result.errorCount === 0 ? (
                    <CheckCircle2 className="h-5 w-5 text-emerald-600" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-amber-600" />
                  )}
                  <span className="text-sm font-bold text-gray-900">
                    {result.dryRun ? "Validation Summary" : "Import Succeeded"}
                  </span>
                </div>
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                    result.errorCount === 0 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                  }`}
                >
                  {result.validCount} valid / {result.totalRows} total rows
                </span>
              </div>

              <p className="text-xs text-gray-600">{result.message}</p>

              {/* Error list if any */}
              {result.errors && result.errors.length > 0 && (
                <div className="mt-3 rounded-lg border border-rose-200 bg-rose-50/50 p-3 max-h-40 overflow-y-auto space-y-1.5">
                  <div className="text-xs font-bold text-rose-900 mb-1">
                    Issues Detected ({result.errors.length}):
                  </div>
                  {result.errors.map((err: any, i: number) => (
                    <div key={i} className="text-xs text-rose-700">
                      • <span className="font-semibold">Row {err.row}:</span> {err.message}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50/50 px-6 py-4 rounded-b-2xl">
          <button
            type="button"
            onClick={handleReset}
            disabled={loading || !selectedFile}
            className="text-xs font-semibold text-gray-500 hover:text-gray-800 disabled:opacity-50 transition"
          >
            Reset
          </button>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => executeImport(true)}
              disabled={loading || !selectedFile}
              className="inline-flex items-center space-x-1.5 rounded-xl border border-gray-300 bg-white px-4 py-2 text-xs font-bold text-gray-700 shadow-sm hover:bg-gray-50 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RefreshCw className="h-3.5 w-3.5" />}
              <span>Validate & Preview</span>
            </button>

            <button
              type="button"
              onClick={() => executeImport(false)}
              disabled={loading || !selectedFile}
              className="inline-flex items-center space-x-1.5 rounded-xl bg-amber-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:bg-amber-700 disabled:opacity-50 transition"
            >
              {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
              <span>Import to Database</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
