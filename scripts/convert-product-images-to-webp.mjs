import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");
const TARGET_DIRECTORIES = [
  path.join(ROOT_DIR, "src", "assets", "photos"),
  path.join(ROOT_DIR, "src", "assets", "cartes"),
];
const INPUT_EXTENSIONS = new Set([".png", ".jpg", ".jpeg"]);

async function walkFiles(dirPath) {
  const entries = await fs.readdir(dirPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await walkFiles(fullPath)));
      continue;
    }

    const extension = path.extname(entry.name).toLowerCase();
    if (INPUT_EXTENSIONS.has(extension)) {
      files.push(fullPath);
    }
  }

  return files;
}

function bytesToKb(bytes) {
  return `${(bytes / 1024).toFixed(1)} KB`;
}

async function convertToWebp(inputPath) {
  const outputPath = inputPath.replace(/\.(png|jpg|jpeg)$/i, ".webp");

  const before = await fs.stat(inputPath);
  await sharp(inputPath)
    .rotate()
    .webp({ quality: 76, effort: 5 })
    .toFile(outputPath);

  const after = await fs.stat(outputPath);
  return {
    inputPath,
    outputPath,
    beforeBytes: before.size,
    afterBytes: after.size,
  };
}

async function main() {
  const results = [];

  for (const directory of TARGET_DIRECTORIES) {
    const imageFiles = await walkFiles(directory);

    for (const imagePath of imageFiles) {
      const converted = await convertToWebp(imagePath);
      results.push(converted);
    }
  }

  const totalBefore = results.reduce((sum, item) => sum + item.beforeBytes, 0);
  const totalAfter = results.reduce((sum, item) => sum + item.afterBytes, 0);
  const gain = totalBefore > 0
    ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1)
    : "0.0";

  console.log(`Converted ${results.length} images to WebP.`);
  console.log(`Before: ${bytesToKb(totalBefore)}`);
  console.log(`After:  ${bytesToKb(totalAfter)}`);
  console.log(`Savings: ${gain}%`);
}

main().catch((error) => {
  console.error("Image conversion failed:", error);
  process.exitCode = 1;
});
