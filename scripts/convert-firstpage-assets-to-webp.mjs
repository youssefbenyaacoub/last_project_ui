import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const ROOT_DIR = path.resolve(SCRIPT_DIR, "..");

const targets = [
  "src/assets/BH_logo2.png",
  "src/assets/bh_logo_blanc.png",
  "src/assets/bh_phones.png",
  "src/assets/bh_strucuture.png",
  "src/assets/bh_clock.png",
  "src/assets/avis/Commerçant tunisien.png",
  "src/assets/avis/Homme âgé tunisien.png",
  "src/assets/avis/Jeune femme tunisienne.png",
  "src/assets/avis/Jeune homme tunisien (moderne).png",
  "src/assets/avis/Étudiant tunisien.png",
  "src/assets/folder carousel hover/Adult in suit.png",
  "src/assets/folder carousel hover/Adult with BH Bank logo.png",
  "src/assets/folder carousel hover/Baby.png",
  "src/assets/folder carousel hover/Child.png",
  "src/assets/folder carousel hover/Teenager.png",
  "src/assets/folder carousel hover/Young adult.png",
  "src/assets/flags/Flag_of_France.svg.png",
];

const bytesToKb = (bytes) => `${(bytes / 1024).toFixed(1)} KB`;

const convert = async (relativePath) => {
  const inputPath = path.join(ROOT_DIR, relativePath);
  const outputPath = inputPath.replace(/\.(png|jpe?g)$/i, ".webp");

  const before = await fs.stat(inputPath);

  await sharp(inputPath)
    .rotate()
    .webp({ quality: 76, effort: 5 })
    .toFile(outputPath);

  const after = await fs.stat(outputPath);

  return {
    relativePath,
    outputPath: path.relative(ROOT_DIR, outputPath),
    beforeBytes: before.size,
    afterBytes: after.size,
  };
};

const main = async () => {
  const results = [];

  for (const relativePath of targets) {
    // Fails loudly if one expected asset is missing.
    results.push(await convert(relativePath));
  }

  const totalBefore = results.reduce((sum, item) => sum + item.beforeBytes, 0);
  const totalAfter = results.reduce((sum, item) => sum + item.afterBytes, 0);
  const gainPct = totalBefore > 0 ? (((totalBefore - totalAfter) / totalBefore) * 100).toFixed(1) : "0.0";

  console.log(`Converted ${results.length} FirstPage assets to WebP.`);
  console.log(`Before: ${bytesToKb(totalBefore)}`);
  console.log(`After:  ${bytesToKb(totalAfter)}`);
  console.log(`Savings: ${gainPct}%`);
};

main().catch((error) => {
  console.error("FirstPage image conversion failed:", error);
  process.exitCode = 1;
});
