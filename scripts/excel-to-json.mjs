import fs from "node:fs"
import path from "node:path"
import XLSX from "xlsx"

const inputXlsx = path.resolve("Input Hopfner.xlsx")
const outputJson = path.resolve("src/data.json")

function toNumber(v, fallback = 0) {
  const n = Number(v)
  return Number.isFinite(n) ? n : fallback
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
    offset: { x: toNumber(r.x, 0), y: toNumber(r.y, 0) }
  }))

fs.writeFileSync(outputJson, JSON.stringify(slides, null, 2), "utf8")
console.log(`Wrote ${outputJson} with ${slides.length} slides`)
