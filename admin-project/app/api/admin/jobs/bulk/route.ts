import connectDB from "@/lib/mongodb";
import Job from "@/models/Job";
import { NextRequest, NextResponse } from "next/server";

const VALID_TYPES = [
  "full-time", "part-time", "contract", "temporary",
  "internship", "remote", "hybrid",
];

const REQUIRED_FIELDS = [
  "title", "description", "salary", "type",
  "company", "category", "country", "applyLink",
] as const;

type JobRow = Record<string, string | undefined>;

// Mirrors the slugify in Job model — insertMany skips pre-save hooks
function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

function generateSlug(title: string, company: string) {
  const base = slugify(`${title}-${company}`);
  const suffix = Math.random().toString(36).substring(2, 6);
  return `${base}-${suffix}`;
}

function validateRow(row: JobRow) {
  const errors: string[] = [];
  for (const field of REQUIRED_FIELDS) {
    if (!row[field] || String(row[field]).trim() === "") {
      errors.push(`Missing required field: "${field}"`);
    }
  }
  if (row.type && !VALID_TYPES.includes(row.type.toLowerCase().trim())) {
    errors.push(`Invalid type "${row.type}". Must be one of: ${VALID_TYPES.join(", ")}`);
  }
  return errors;
}

function extractWriteErrorMessage(we: unknown): string {
  if (!we || typeof we !== "object") return "Unknown write error";
  const maybeObject = we as Record<string, unknown>;
  return (
    (maybeObject.errmsg as string) ??
    ((maybeObject.err as Record<string, unknown>)?.message as string) ??
    (maybeObject.message as string) ??
    ((maybeObject.writeError as Record<string, unknown>)?.errmsg as string) ??
    "Unknown write error"
  );
}

export async function POST(request: NextRequest) {
  try {
    const secret = request.headers.get("secret");
    if (secret !== process.env.ADMIN_SECRET) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const rows: JobRow[] = body.jobs;

    if (!Array.isArray(rows) || rows.length === 0) {
      return NextResponse.json({ error: "No jobs provided." }, { status: 400 });
    }

    if (rows.length > 500) {
      return NextResponse.json({ error: "Batch limit is 500 jobs per request." }, { status: 400 });
    }

    await connectDB();

    const validJobs: object[] = [];
    const rowErrors: { row: number; errors: string[] }[] = [];

    rows.forEach((row, i) => {
      const errors = validateRow(row);
      if (errors.length > 0) {
        rowErrors.push({ row: i + 1, errors });
      } else {
        validJobs.push({
          title: row.title.trim(),
          description: row.description.trim(),
          salary: row.salary.trim(),
          type: row.type.toLowerCase().trim(),
          company: row.company.trim(),
          category: row.category.toLowerCase().trim(),
          country: row.country.trim(),
          applyLink: row.applyLink.trim(),
          location: row.location?.trim() || "",
          status: row.status?.trim() || "active",
          // Must be generated here — insertMany skips pre-save hooks
          slug: generateSlug(row.title, row.company),
        });
      }
    });

    let inserted = 0;
    const insertErrors: { message: string }[] = [];

    if (validJobs.length > 0) {
      try {
        const result = await Job.insertMany(validJobs, {
          ordered: false,
          rawResult: true,
        });
        inserted = result.insertedCount ?? validJobs.length;
      } catch (err: unknown) {
        const bulkError = err as {
          name?: string;
          result?: { nInserted?: number };
          writeErrors?: unknown[];
        };

        if (bulkError?.name === "MongoBulkWriteError") {
          inserted = bulkError.result?.nInserted ?? 0;
          (bulkError.writeErrors ?? []).forEach((we) => {
            insertErrors.push({
              message: `DB write error: ${extractWriteErrorMessage(we)}`,
            });
          });
        } else {
          throw err;
        }
      }
    }

    return NextResponse.json({
      success: true,
      inserted,
      skipped: rowErrors.length + insertErrors.length,
      total: rows.length,
      validationErrors: rowErrors,
      writeErrors: insertErrors,
    });
  } catch (error) {
    console.error("Error in POST /api/admin/jobs/bulk:", error);
    return NextResponse.json(
      { error: "Internal server error during bulk import." },
      { status: 500 }
    );
  }
}
