"use client";

import { useRef, useState } from "react";
import { Upload, Download, FileSpreadsheet, AlertCircle, CheckCircle2 } from "lucide-react";
import Papa from "papaparse";
import {
  type ColumnDef,
  generateCsvTemplate,
  downloadCsv,
} from "@/lib/import/csv-templates";

interface CsvImportBlockProps {
  columns: ColumnDef[];
  templateFilename: string;
  onImport: (rows: Record<string, string>[]) => { imported: number; errors: string[] };
  entityLabel: string; // "équipes" | "clients"
}

export function CsvImportBlock({
  columns,
  templateFilename,
  onImport,
  entityLabel,
}: CsvImportBlockProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importResult, setImportResult] = useState<{
    imported: number;
    errors: string[];
  } | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleDownloadTemplate = () => {
    const content = generateCsvTemplate(columns);
    downloadCsv(content, templateFilename);
  };

  const handleFile = (file: File) => {
    setImportResult(null);

    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      encoding: "UTF-8",
      complete: (results) => {
        if (results.data.length === 0) {
          setImportResult({ imported: 0, errors: ["Le fichier est vide"] });
          return;
        }
        const result = onImport(results.data);
        setImportResult(result);
      },
      error: (err) => {
        setImportResult({
          imported: 0,
          errors: [`Erreur de lecture: ${err.message}`],
        });
      },
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file && (file.name.endsWith(".csv") || file.name.endsWith(".txt"))) {
      handleFile(file);
    }
  };

  const requiredCols = columns.filter((c) => c.required);
  const optionalCols = columns.filter((c) => !c.required);

  return (
    <div className="rounded-xl border border-gray-200 bg-gray-50/50 p-5">
      <div className="mb-4 flex items-center gap-2">
        <FileSpreadsheet className="h-5 w-5 text-[#4A90A4]" />
        <h4 className="text-sm font-semibold text-gray-900">
          Importer depuis un fichier CSV
        </h4>
      </div>

      {/* Column descriptions */}
      <div className="mb-4 rounded-lg border border-gray-200 bg-white p-4 text-xs">
        <p className="mb-2 font-medium text-gray-700">
          Colonnes requises :
        </p>
        <div className="mb-3 space-y-1">
          {requiredCols.map((col) => (
            <div key={col.key} className="flex gap-2">
              <span className="min-w-[140px] font-semibold text-gray-900">
                {col.label} *
              </span>
              <span className="text-gray-500">
                {col.description} — ex: <code className="rounded bg-gray-100 px-1">{col.example}</code>
              </span>
            </div>
          ))}
        </div>
        {optionalCols.length > 0 && (
          <>
            <p className="mb-2 font-medium text-gray-700">
              Colonnes optionnelles :
            </p>
            <div className="space-y-1">
              {optionalCols.map((col) => (
                <div key={col.key} className="flex gap-2">
                  <span className="min-w-[140px] font-medium text-gray-600">
                    {col.label}
                  </span>
                  <span className="text-gray-400">
                    {col.description} — ex: <code className="rounded bg-gray-100 px-1">{col.example}</code>
                  </span>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Actions row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleDownloadTemplate}
          className="flex items-center gap-2 rounded-lg border border-[#4A90A4]/30 bg-[#4A90A4]/5 px-4 py-2 text-xs font-medium text-[#4A90A4] transition-colors hover:bg-[#4A90A4]/10"
        >
          <Download className="h-4 w-4" />
          Télécharger le template CSV
        </button>

        <div
          className={`relative flex flex-1 items-center justify-center rounded-lg border-2 border-dashed px-4 py-3 transition-colors ${
            dragOver
              ? "border-[#2D5A3D] bg-[#2D5A3D]/5"
              : "border-gray-300 hover:border-[#2D5A3D]/50"
          }`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv,.txt"
            onChange={handleFileChange}
            className="absolute inset-0 cursor-pointer opacity-0"
          />
          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Upload className="h-4 w-4" />
            <span>
              Glisser un fichier CSV ou{" "}
              <span className="font-medium text-[#2D5A3D]">parcourir</span>
            </span>
          </div>
        </div>
      </div>

      {/* Import result */}
      {importResult && (
        <div className="mt-3 space-y-1">
          {importResult.imported > 0 && (
            <div className="flex items-center gap-2 rounded-lg bg-green-50 px-3 py-2 text-xs text-green-700">
              <CheckCircle2 className="h-4 w-4" />
              {importResult.imported} {entityLabel} importé(e)s avec succès
            </div>
          )}
          {importResult.errors.map((err, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-600"
            >
              <AlertCircle className="mt-0.5 h-3 w-3 shrink-0" />
              {err}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
