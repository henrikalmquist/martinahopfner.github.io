import fs from "node:fs"
import path from "node:path"
import XLSX from "xlsx"   // ← IMPORTANT (no * as)

const inputXlsx = path.resolve("Input Hopfner.xlsx")
const outputJson = path.resolve("src/data.json")

function toNumber(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
}

function toMobileFlag(v, fallback = 1) {
  // Goal: output exactly 1 or 0 in JSON.
  // Accepts: 1/0, "1"/"0", true/false, "true"/"false", "yes"/"no"
  if (v === "" || v === null || typeof v === "undefined") return fallback

  if (typeof v === "boolean") return v ? 1 : 0

  const s = String(v).trim().toLowerCase()
  if (s === "1") return 1
  if (s === "0") return 0
  if (s === "true" || s === "yes" || s === "y") return 1
  if (s === "false" || s === "no" || s === "n") return 0

  const n = Number(s)
  if (Number.isFinite(n)) return n > 0 ? 1 : 0

  return fallback
}

const wb = XLSX.readFile(inputXlsx)
const ws = wb.Sheets[wb.SheetNames[0]]
const rows = XLSX.utils.sheet_to_json(ws, { defval: "" })

const slides = rows
  .filter((r) => String(r.img || "").trim() !== "")
  .map((r) => ({
    src: `/${String(r.img).trim()}`,
    alt: String(r["img-txt"] || r.title || "").trim(),
    title: String(r.title || "").trim(),
    legend: String(r.legend || "")
      .split(/\r?\n/)
      .map((s) => s.trim())
      .filter(Boolean),
    offset: { x: toNumber(r.x, 0), y: toNumber(r.y, 0) },
    mobile: toMobileFlag(r.mobile, 1), // 1 = show on mobile, 0 = hide on mobile
  }))

fs.mkdirSync(path.dirname(outputJson), { recursive: true })
fs.writeFileSync(outputJson, JSON.stringify(slides, null, 2), "utf8")
console.log(`Wrote ${outputJson} with ${slides.length} slides`)