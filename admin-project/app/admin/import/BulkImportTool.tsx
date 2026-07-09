"use client";
import React, { useState, useRef, useCallback } from "react";

// ── types ────────────────────────────────────────────────────────────────────
type JobRow = {
  title: string; description: string; salary: string; type: string;
  company: string; category: string; country: string; applyLink: string;
  location?: string; status?: string;
};
type ParsedRow = { index: number; data: JobRow; errors: string[]; included: boolean };
type ImportResult = { inserted: number; skipped: number; total: number; validationErrors: { row: number; errors: string[] }[]; writeErrors: { message: string }[] };

const VALID_TYPES = ["full-time","part-time","contract","temporary","internship","remote","hybrid"];
const REQUIRED = ["title","description","salary","type","company","category","country","applyLink"] as const;

// ── helpers ──────────────────────────────────────────────────────────────────
function validateRow(row: Partial<JobRow>): string[] {
  const errs: string[] = [];
  for (const f of REQUIRED) if (!row[f]?.trim()) errs.push(`Missing: ${f}`);
  if (row.type && !VALID_TYPES.includes(row.type.toLowerCase().trim()))
    errs.push(`Invalid type "${row.type}"`);
  return errs;
}

import Papa from "papaparse";

const FIELD_ALIASES: Record<string, keyof JobRow> = {
  title: "title",
  description: "description",
  salary: "salary",
  type: "type",
  company: "company",
  category: "category",
  country: "country",
  applylink: "applyLink",
  "apply link": "applyLink",
  "apply_link": "applyLink",
  location: "location",
  status: "status",
};

function normalizeHeader(header: string): string {
  return header.trim().toLowerCase().replace(/^["']|["']$/g, "").replace(/[_\s-]+/g, " ").trim();
}

function normalizeValue(value: string | undefined | null): string {
  if (value == null) return "";
  const trimmed = value.toString().trim().replace(/^"|"$/g, "");
  if (trimmed.toLowerCase() === "undefined" || trimmed.toLowerCase() === "null") return "";
  return trimmed;
}

function mapRowKeys(row: Record<string, string>): JobRow {
  const mapped: Partial<JobRow> = {};

  Object.entries(row).forEach(([key, value]) => {
    const normalizedKey = normalizeHeader(key);
    const alias = FIELD_ALIASES[normalizedKey] || FIELD_ALIASES[normalizedKey.replace(/\s+/g, "")] || null;
    const normalizedValue = normalizeValue(value);

    if (alias) {
      mapped[alias] = normalizedValue;
    } else if (key in mapped) {
      mapped[key as keyof JobRow] = normalizedValue;
    }
  });

  return {
    title: mapped.title || "",
    description: mapped.description || "",
    salary: mapped.salary || "Not specified",
    type: mapped.type || "",
    company: mapped.company || "Unknown Company",
    category: mapped.category || "",
    country: mapped.country || "",
    applyLink: mapped.applyLink || "",
    location: mapped.location || "",
    status: mapped.status || "active",
  };
}

function parseCSV(text: string): JobRow[] {
  const parsed = Papa.parse<Record<string, string>>(text, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h) => normalizeHeader(h ?? ""),
    transform: (v) => normalizeValue(v as string),
  });

  if (parsed.errors && parsed.errors.length > 0) {
    throw new Error(parsed.errors.map((e) => e.message || "CSV parse error").join("; "));
  }

  return (parsed.data || []).map((row) => mapRowKeys(row));
}

function parseJSON(text: string): JobRow[] {
  const data = JSON.parse(text);
  const rows = Array.isArray(data) ? data : data.jobs ?? [];
  return rows.map((row: Record<string, unknown>) => {
    const stringRow: Record<string, string> = {};
    Object.entries(row).forEach(([key, value]) => {
      stringRow[key] = value == null ? "" : String(value);
    });
    return mapRowKeys(stringRow);
  });
}

function getErrorMessage(error: unknown) {
  if (error instanceof Error) return error.message;
  try { return String(error); } catch { return "Unknown error"; }
}

const CSV_TEMPLATE = `title,description,salary,type,company,category,country,applyLink,location,status
"Senior Developer","Build amazing products","$5000/mo","full-time","Acme Corp","engineering","Egypt","https://apply.example.com","Cairo","active"
`;
const JSON_TEMPLATE = JSON.stringify([{ title:"Senior Developer", description:"Build amazing products", salary:"$5000/mo", type:"full-time", company:"Acme Corp", category:"engineering", country:"Egypt", applyLink:"https://apply.example.com", location:"Cairo", status:"active" }], null, 2);

function downloadFile(content: string, name: string, mime: string) {
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob([content], { type: mime }));
  a.download = name; a.click();
}

// ── component ────────────────────────────────────────────────────────────────
export default function BulkImportTool() {
  const [step, setStep] = useState<1|2|3>(1);
  const [rows, setRows] = useState<ParsedRow[]>([]);
  const [secret, setSecret] = useState("");
  const [dragging, setDragging] = useState(false);
  const [pasteText, setPasteText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: "success"|"error" } | null>(null);
  const [parseError, setParseError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const showToast = (msg: string, type: "success"|"error") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 5000);
  };

  const processText = useCallback((text: string, ext: string) => {
    setParseError("");
    try {
      const raw = ext === "json" ? parseJSON(text) : parseCSV(text);
      if (!raw.length) { setParseError("No rows found in file."); return; }
      setRows(raw.map((d, i) => ({ index: i, data: d, errors: validateRow(d), included: true })));
      setStep(2);
    } catch (e: unknown) { setParseError(`Parse error: ${getErrorMessage(e)}`); }
  }, []);

  const handleFile = (file: File) => {
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "csv";
    const reader = new FileReader();
    reader.onload = e => processText(e.target?.result as string, ext);
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const toggleRow = (i: number) =>
    setRows(prev => prev.map(r => r.index === i ? { ...r, included: !r.included } : r));

  const handleSubmit = async () => {
    const toSend = rows.filter(r => r.included && r.errors.length === 0).map(r => r.data);
    if (!toSend.length) { showToast("No valid rows to submit.", "error"); return; }
    if (!secret.trim()) { showToast("Please enter the admin secret.", "error"); return; }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/jobs/bulk", {
        method: "POST",
        headers: { "Content-Type": "application/json", secret },
        body: JSON.stringify({ jobs: toSend }),
      });
      const data = await res.json();
      if (!res.ok) { showToast(data.error ?? "Request failed.", "error"); setLoading(false); return; }
      setResult(data);
      setStep(3);
    } catch (e: unknown) { showToast(getErrorMessage(e), "error"); }
    finally { setLoading(false); }
  };

  const reset = () => { setStep(1); setRows([]); setSecret(""); setResult(null); setPasteText(""); setParseError(""); };

  const valid = rows.filter(r => r.included && r.errors.length === 0).length;
  const invalid = rows.filter(r => r.errors.length > 0).length;

  return (
    <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden text-zinc-900 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
      <style>{`
        .step-circle { width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:14px; transition:all .3s; }
        .step-circle.done { background:#4f46e5; color:#fff; }
        .step-circle.active { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; box-shadow:0 0 15px rgba(79, 70, 229, .3); }
        .step-circle.pending { background:#f4f4f5; color:#a1a1aa; border:1px solid #e4e4e7; }
        .step-label { font-size:11px; color:#a1a1aa; font-weight:600; text-transform:uppercase; letter-spacing:.04em; }
        .step-label.active { color:#4f46e5; }
        .step-line { width:60px; height:2px; background:#f4f4f5; margin-bottom:18px; }
        .step-line.done { background:#4f46e5; }
        .drop-zone { border:2px dashed #e0e7ff; border-radius:16px; padding:60px 20px; text-align:center; cursor:pointer; transition:all .3s; background:#eef2ff; }
        .drop-zone:hover,.drop-zone.drag { border-color:#4f46e5; background:#e0e7ff; }
        .btn { display:inline-flex; align-items:center; gap:8px; padding:10px 20px; border-radius:10px; font-weight:600; font-size:14px; cursor:pointer; border:none; transition:all .2s; }
        .btn-primary { background:linear-gradient(135deg,#4f46e5,#7c3aed); color:#fff; }
        .btn-primary:hover { opacity:.9; transform:translateY(-1px); box-shadow:0 4px 15px rgba(79, 70, 229, .2); }
        .btn-primary:disabled { opacity:.5; cursor:not-allowed; transform:none; }
        .btn-ghost { background:#f4f4f5; color:#52525b; }
        .btn-ghost:hover { background:#e4e4e7; color:#18181b; }
        .textarea { width:100%; background:#fafafa; border:1px solid #e4e4e7; border-radius:12px; padding:16px; color:#18181b; font-size:13px; font-family:monospace; resize:vertical; outline:none; min-height:120px; transition:border-color .2s; }
        .textarea:focus { border-color:#4f46e5; }
        .input { background:#fff; border:1px solid #e4e4e7; border-radius:10px; padding:12px 16px; color:#18181b; font-size:14px; outline:none; width:100%; transition:border-color .2s; }
        .input:focus { border-color:#4f46e5; }
        .table-wrap { overflow-x:auto; border:1px solid #e4e4e7; border-radius:12px; max-height:400px; overflow-y:auto; }
        table { width:100%; border-collapse:collapse; font-size:13px; }
        th { background:#f8fafc; color:#64748b; padding:12px 16px; text-align:left; font-weight:600; text-transform:uppercase; font-size:11px; letter-spacing:.05em; position:sticky; top:0; z-index:1; }
        td { padding:12px 16px; border-top:1px solid #f1f5f9; vertical-align:top; }
        tr.invalid td { background:#fef2f2; }
        tr:hover td { background:#f8fafc; }
      `}</style>
      
      <div className="p-8 border-b border-zinc-100 text-center">
        <h2 className="text-2xl font-bold text-zinc-900">Bulk Job Importer</h2>
        <p className="text-zinc-500 mt-2">Upload a CSV or JSON file to import jobs in bulk</p>
      </div>

      <div className="p-8">
        {/* Steps */}
        <div className="flex justify-center items-center gap-0 mb-10">
          {([1,2,3] as const).map((s, idx) => (
            <React.Fragment key={s}>
              <div className="flex flex-col items-center gap-2">
                <div className={`step-circle ${step > s ? "done" : step === s ? "active" : "pending"}`}>
                  {step > s ? "✓" : s}
                </div>
                <span className={`step-label ${step === s ? "active" : ""}`}>
                  {s === 1 ? "Upload" : s === 2 ? "Preview" : "Done"}
                </span>
              </div>
              {idx < 2 && <div className={`step-line ${step > s ? "done" : ""}`} />}
            </React.Fragment>
          ))}
        </div>

        {/* STEP 1 */}
        {step === 1 && (
          <div className="space-y-6 max-w-3xl mx-auto">
            <div
              className={`drop-zone${dragging ? " drag" : ""}`}
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
            >
              <div className="text-5xl mb-4">📂</div>
              <div className="text-lg font-semibold text-zinc-800 mb-2">Drop your file here</div>
              <div className="text-sm text-zinc-500">Supports .csv and .json · Max 500 rows</div>
              <input ref={fileRef} type="file" accept=".csv,.json" style={{ display:"none" }}
                onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); }} />
            </div>

            {parseError && <div className="p-3 bg-red-50 text-red-700 text-sm rounded-lg border border-red-200">⚠ {parseError}</div>}

            <div className="flex flex-wrap justify-center gap-3">
              <button className="btn btn-ghost" onClick={() => downloadFile(CSV_TEMPLATE, "karirak-jobs-template.csv", "text/csv")}>
                ⬇ Download CSV Template
              </button>
              <button className="btn btn-ghost" onClick={() => downloadFile(JSON_TEMPLATE, "karirak-jobs-template.json", "application/json")}>
                ⬇ Download JSON Template
              </button>
            </div>

            <div className="flex items-center gap-4 my-6 text-zinc-400 text-sm font-medium">
              <div className="flex-1 h-px bg-zinc-200"></div>
              or paste JSON
              <div className="flex-1 h-px bg-zinc-200"></div>
            </div>
            
            <textarea className="textarea" placeholder='[{"title":"...","company":"..."}]' value={pasteText}
              onChange={e => setPasteText(e.target.value)} rows={5} />
            
            <div className="flex justify-end">
              <button className="btn btn-primary" onClick={() => processText(pasteText, "json")} disabled={!pasteText.trim()}>
                Parse JSON →
              </button>
            </div>
          </div>
        )}

        {/* STEP 2 */}
        {step === 2 && (
          <div className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-center">
              <div className="flex-1 min-w-[120px] bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-emerald-600">{valid}</div>
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mt-1">Valid rows</div>
              </div>
              <div className="flex-1 min-w-[120px] bg-red-50 border border-red-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-red-600">{invalid}</div>
                <div className="text-xs font-semibold text-red-700 uppercase tracking-wide mt-1">Invalid rows</div>
              </div>
              <div className="flex-1 min-w-[120px] bg-blue-50 border border-blue-100 rounded-xl p-4 text-center">
                <div className="text-3xl font-bold text-blue-600">{rows.length}</div>
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mt-1">Total rows</div>
              </div>
            </div>

            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>✓</th><th>#</th><th>Title</th><th>Company</th><th>Type</th>
                    <th>Country</th><th>Category</th><th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map(row => (
                    <tr key={row.index} className={row.errors.length > 0 ? "invalid" : ""}>
                      <td>
                        <input type="checkbox" checked={row.included}
                          onChange={() => toggleRow(row.index)}
                          disabled={row.errors.length > 0} />
                      </td>
                      <td className="text-zinc-500">{row.index + 1}</td>
                      <td className="max-w-[200px] truncate">
                        {row.data.title || <span className="text-red-500">—</span>}
                        {row.errors.length > 0 && <div className="text-[10px] text-red-500 mt-1">{row.errors.slice(0,2).join(" · ")}{row.errors.length > 2 ? ` +${row.errors.length-2} more` : ""}</div>}
                      </td>
                      <td className="max-w-[150px] truncate">{row.data.company}</td>
                      <td>{row.data.type ? <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{row.data.type}</span> : <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-semibold">?</span>}</td>
                      <td>{row.data.country}</td>
                      <td>{row.data.category}</td>
                      <td><span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-xs font-semibold">{row.data.status || "active"}</span></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="max-w-sm">
              <p className="text-sm font-semibold text-zinc-700 mb-2">Admin Secret</p>
              <input className="input" type="password" placeholder="Enter your ADMIN_SECRET…"
                value={secret} onChange={e => setSecret(e.target.value)} />
            </div>

            <div className="flex justify-between items-center border-t border-zinc-100 pt-6">
              <button className="btn btn-ghost" onClick={reset}>← Back</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={loading || valid === 0}>
                {loading ? "Importing…" : `Import ${valid} Job${valid !== 1 ? "s" : ""} →`}
              </button>
            </div>
          </div>
        )}

        {/* STEP 3 */}
        {step === 3 && result && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">{result.inserted > 0 ? "🎉" : "⚠️"}</div>
            <div className="text-2xl font-bold text-zinc-900 mb-8">
              {result.inserted > 0 ? "Import Complete!" : "Import Finished with Issues"}
            </div>
            
            <div className="flex flex-wrap gap-4 justify-center max-w-xl mx-auto">
              <div className="flex-1 bg-emerald-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-emerald-600">{result.inserted}</div>
                <div className="text-xs font-semibold text-emerald-700 uppercase tracking-wide mt-1">Inserted</div>
              </div>
              <div className="flex-1 bg-red-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-red-600">{result.skipped}</div>
                <div className="text-xs font-semibold text-red-700 uppercase tracking-wide mt-1">Skipped</div>
              </div>
              <div className="flex-1 bg-blue-50 rounded-xl p-4">
                <div className="text-3xl font-bold text-blue-600">{result.total}</div>
                <div className="text-xs font-semibold text-blue-700 uppercase tracking-wide mt-1">Total sent</div>
              </div>
            </div>

            {(result.validationErrors.length > 0 || result.writeErrors.length > 0) && (
              <div className="max-h-48 overflow-y-auto mt-6 text-left border border-red-200 rounded-xl p-4 bg-red-50 max-w-2xl mx-auto">
                {result.validationErrors.map(e => (
                  <div className="text-sm text-red-600 py-1 border-b border-red-100 last:border-0" key={e.row}>Row {e.row}: {e.errors.join(" · ")}</div>
                ))}
                {result.writeErrors.map((e, i) => (
                  <div className="text-sm text-red-600 py-1 border-b border-red-100 last:border-0" key={`w${i}`}>{e.message}</div>
                ))}
              </div>
            )}

            <div className="flex justify-center gap-4 mt-8">
              <button className="btn btn-primary" onClick={reset}>Import Another File</button>
              <a href="/admin/manage" className="btn btn-ghost">← Back to Dashboard</a>
            </div>
          </div>
        )}
      </div>

      {toast && (
        <div className={`fixed bottom-8 right-8 px-5 py-3 rounded-xl shadow-lg font-medium text-sm z-50 animate-in slide-in-from-bottom-4 ${toast.type === "success" ? "bg-emerald-100 text-emerald-800 border border-emerald-200" : "bg-red-100 text-red-800 border border-red-200"}`}>
          {toast.type === "success" ? "✓" : "⚠"} {toast.msg}
        </div>
      )}
    </div>
  );
}
