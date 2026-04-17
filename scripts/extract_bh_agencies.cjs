const fs = require("fs");
const path = require("path");

const inputPath = path.resolve(__dirname, "..", "_bh_views_ajax.json");
const outJsonPath = path.resolve(__dirname, "..", "bh_agencies_from_bhbank_site.json");
const outCsvPath = path.resolve(__dirname, "..", "bh_agencies_from_bhbank_site.csv");

if (!fs.existsSync(inputPath)) {
  console.error(`Input not found: ${inputPath}`);
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const insertCmd = payload.find((item) => item.command === "insert" && typeof item.data === "string" && item.data.length > 1000);

if (!insertCmd) {
  console.error("Could not find insert command with agency HTML.");
  process.exit(1);
}

const html = insertCmd.data;
const marker = '<div class="views-field views-field-title views-accordion-header';

function cleanText(value) {
  return String(value || "")
    .replace(/<br\s*\/?\s*>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&#039;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, " ")
    .trim();
}

const rows = [];
let index = 0;

while (true) {
  const markerPos = html.indexOf(marker, index);
  if (markerPos < 0) break;

  const nameStart = html.indexOf(">", markerPos);
  const nameEnd = html.indexOf("</div>", nameStart);
  if (nameStart < 0 || nameEnd < 0) break;

  const name = cleanText(html.slice(nameStart + 1, nameEnd));
  const nextMarkerPos = html.indexOf(marker, nameEnd);
  const block = html.slice(nameEnd, nextMarkerPos < 0 ? html.length : nextMarkerPos);

  const paragraphMatches = [...block.matchAll(/<p>([\s\S]*?)<\/p>/g)].map((m) => cleanText(m[1]));
  const contactMatch = block.match(/Contact\s*:\s*([^<\n\r]+)/i);
  const emailMatch = block.match(/Email\s*:\s*([A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,})/i);

  let address = "";
  if (paragraphMatches.length) {
    const firstPara = paragraphMatches[0] || "";
    if (!/^contact\s*:/i.test(firstPara) && !/^email\s*:/i.test(firstPara)) {
      address = firstPara;
    }
  }

  rows.push({
    name,
    address,
    contact: cleanText(contactMatch ? contactMatch[1] : ""),
    email: cleanText(emailMatch ? emailMatch[1] : "").toLowerCase(),
  });

  index = nameEnd + 6;
}

const unique = [];
const seen = new Set();
for (const row of rows) {
  const key = row.name.toLowerCase();
  if (!row.name || seen.has(key)) continue;
  seen.add(key);
  unique.push(row);
}

fs.writeFileSync(outJsonPath, JSON.stringify(unique, null, 2), "utf8");

const csvEscape = (v) => {
  const s = String(v ?? "");
  if (/[",\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`;
  }
  return s;
};

const csvLines = ["name,address,contact,email"];
for (const row of unique) {
  csvLines.push([
    csvEscape(row.name),
    csvEscape(row.address),
    csvEscape(row.contact),
    csvEscape(row.email),
  ].join(","));
}
fs.writeFileSync(outCsvPath, `${csvLines.join("\n")}\n`, "utf8");

console.log(`TOTAL_RAW=${rows.length}`);
console.log(`TOTAL_UNIQUE=${unique.length}`);
console.log(`OUT_JSON=${outJsonPath}`);
console.log(`OUT_CSV=${outCsvPath}`);
console.log("FIRST_10=");
unique.slice(0, 10).forEach((row, i) => {
  console.log(`${i + 1}. ${row.name} | ${row.address} | ${row.contact} | ${row.email}`);
});
