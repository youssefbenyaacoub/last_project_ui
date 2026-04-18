import { spawn } from "node:child_process";
import { promises as fs } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

const ROUTES = [
  "/",
  "/login",
  "/reset-password",
  "/agent/login",
  "/agent/reset-password",
  "/agent/change-password",
  "/agent/dashboard",
  "/agent/admin",
  "/signin",
  "/faq",
  "/user-guides",
  "/support-center",
  "/privacy-policy",
  "/terms-of-service",
  "/security",
  "/quest",
  "/client",
  "/dashboard",
  "/dashboard/profile",
  "/dashboard/chatbot",
  "/dashboard/products",
  "/dashboard/product-comparator",
  "/dashboard/simulator",
  "/dashboard/budget",
  "/dashboard/reclamation",
  "/dashboard/parametres",
];

const CATEGORIES = ["performance", "accessibility", "best-practices", "seo"];

const LH_HOST = process.env.LH_HOST || "127.0.0.1";
const LH_PORT = Number.parseInt(process.env.LH_PORT || "4173", 10);
const DEFAULT_BASE_URL = process.env.LH_BASE_URL || `http://${LH_HOST}:${LH_PORT}`;
let activeBaseUrl = DEFAULT_BASE_URL;
const PAGE_DELAY_MS = Number.parseInt(process.env.LH_PAGE_DELAY_MS || "1200", 10);

const REPORT_TIMESTAMP = new Date().toISOString().replace(/[:.]/g, "-");
const REPORT_DIR = path.join(ROOT_DIR, "lighthouse-reports", REPORT_TIMESTAMP);

const NPM_CMD = "npm";
const NPX_CMD = "npx";

let previewProcess = null;

function stripAnsi(value) {
  return String(value || "").replace(/\x1B\[[0-9;]*m/g, "");
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function runCommand(command, args, options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      cwd: ROOT_DIR,
      env: process.env,
      shell: true,
      ...options,
    });

    let stdout = "";
    let stderr = "";

    if (child.stdout) {
      child.stdout.on("data", (chunk) => {
        const text = chunk.toString();
        stdout += text;
        process.stdout.write(text);
      });
    }

    if (child.stderr) {
      child.stderr.on("data", (chunk) => {
        const text = chunk.toString();
        stderr += text;
        process.stderr.write(text);
      });
    }

    child.on("error", (error) => {
      reject(error);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve({ code, stdout, stderr });
      } else {
        reject(new Error(`Command failed (${code}): ${command} ${args.join(" ")}`));
      }
    });
  });
}

async function buildProject() {
  console.log("\n[1/4] Building production bundle...");
  await runCommand(NPM_CMD, ["run", "build"]);
}

async function startPreview() {
  console.log(`\n[2/4] Starting preview server on ${activeBaseUrl}...`);

  return new Promise((resolve, reject) => {
    const args = ["run", "preview", "--", "--host", LH_HOST, "--port", String(LH_PORT)];
    const child = spawn(NPM_CMD, args, {
      cwd: ROOT_DIR,
      env: process.env,
      shell: true,
    });

    previewProcess = child;

    let startupOutput = "";
    let resolved = false;

    const timeout = setTimeout(() => {
      if (resolved) return;
      resolved = true;
      reject(new Error("Preview server did not start within 45s."));
    }, 45_000);

    const onData = (chunk) => {
      const text = chunk.toString();
      startupOutput += text;
      process.stdout.write(text);

      const cleanOutput = stripAnsi(startupOutput);
      const urlMatches = cleanOutput.match(/https?:\/\/[^\s]+/g) || [];
      const discoveredUrl = urlMatches.length > 0
        ? urlMatches[urlMatches.length - 1].replace(/\/$/, "")
        : "";

      if (!resolved && discoveredUrl) {
        activeBaseUrl = discoveredUrl;
        console.log(`\n[preview] Using ${activeBaseUrl}`);
        resolved = true;
        clearTimeout(timeout);
        resolve();
      }
    };

    if (child.stdout) child.stdout.on("data", onData);
    if (child.stderr) child.stderr.on("data", onData);

    child.on("error", (error) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      reject(error);
    });

    child.on("close", (code) => {
      if (resolved) return;
      resolved = true;
      clearTimeout(timeout);
      reject(new Error(`Preview server exited early with code ${code}.`));
    });
  });
}

async function stopPreview() {
  if (!previewProcess) return;

  await new Promise((resolve) => {
    const child = previewProcess;
    let done = false;

    const finalize = () => {
      if (done) return;
      done = true;
      resolve();
    };

    child.once("close", finalize);

    try {
      child.kill("SIGTERM");
    } catch {
      finalize();
      return;
    }

    setTimeout(() => {
      try {
        if (!done) child.kill("SIGKILL");
      } catch {
        // Ignore secondary kill errors.
      }
      finalize();
    }, 3_000);
  });

  previewProcess = null;
}

function safeRouteName(route) {
  if (route === "/") return "home";
  return route
    .replace(/^\//, "")
    .replace(/\//g, "_")
    .replace(/[^a-zA-Z0-9_-]/g, "_");
}

function scoreToPercent(value) {
  if (typeof value !== "number") return null;
  return Math.round(value * 100);
}

async function pathExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function runLighthouseForRoute(route) {
  const url = new URL(route, `${activeBaseUrl}/`).toString();
  const fileBase = path.join(REPORT_DIR, safeRouteName(route));
  const jsonPath = `${fileBase}.report.json`;
  const htmlPath = `${fileBase}.report.html`;

  const args = [
    "--yes",
    "lighthouse",
    url,
    `--only-categories=${CATEGORIES.join(",")}`,
    "--chrome-flags=--headless --no-sandbox --disable-gpu",
    "--quiet",
    "--output=json",
    "--output=html",
    `--output-path=${fileBase}`,
  ];

  let commandError = "";

  // Some Windows environments return a non-zero exit code even when reports are produced.
  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      await runCommand(NPX_CMD, args);
      commandError = "";
      break;
    } catch (error) {
      commandError = error?.message || String(error);
      const hasJson = await pathExists(jsonPath);
      const hasHtml = await pathExists(htmlPath);

      if (hasJson && hasHtml) {
        console.warn(`[warn] Non-zero Lighthouse exit for ${route}, using generated reports.`);
        break;
      }

      if (attempt < 2) {
        console.warn(`[warn] Lighthouse failed for ${route}, retrying once...`);
        await sleep(1500);
      }
    }
  }

  const hasJson = await pathExists(jsonPath);
  const hasHtml = await pathExists(htmlPath);
  if (!hasJson || !hasHtml) {
    return {
      route,
      url,
      jsonPath,
      htmlPath,
      performance: null,
      accessibility: null,
      bestPractices: null,
      seo: null,
      status: "failed",
      error: commandError || "Lighthouse report files were not generated.",
    };
  }

  const payload = JSON.parse(await fs.readFile(jsonPath, "utf8"));

  return {
    route,
    url,
    jsonPath,
    htmlPath,
    performance: scoreToPercent(payload.categories?.performance?.score),
    accessibility: scoreToPercent(payload.categories?.accessibility?.score),
    bestPractices: scoreToPercent(payload.categories?.["best-practices"]?.score),
    seo: scoreToPercent(payload.categories?.seo?.score),
    status: commandError ? "ok-with-warning" : "ok",
    error: commandError || "",
  };
}

async function writeSummary(results) {
  const header = [
    "| Route | Status | Performance | Accessibilite | Bonnes pratiques | SEO |",
    "| --- | --- | ---: | ---: | ---: | ---: |",
  ];

  const rows = results.map((result) => {
    return `| ${result.route} | ${result.status || "-"} | ${result.performance ?? "-"} | ${result.accessibility ?? "-"} | ${result.bestPractices ?? "-"} | ${result.seo ?? "-"} |`;
  });

  const failedRoutes = results.filter((item) => item.status === "failed");
  const warningRoutes = results.filter((item) => item.status === "ok-with-warning");

  const summaryContent = [
    "# Lighthouse Diagnostics (All Routes)",
    "",
    `Base URL: ${activeBaseUrl}`,
    `Generated at: ${new Date().toISOString()}`,
    "",
    ...header,
    ...rows,
    "",
    `Failed routes: ${failedRoutes.length}`,
    `Routes with warnings: ${warningRoutes.length}`,
    "",
    "## Notes",
    "",
    "- Les routes protegees (ex: dashboard, agent/admin) peuvent etre mesurees sur leur etat de redirection si non authentifie.",
    "- Pour auditer une session authentifiee, il faut injecter l'etat/cookies avant l'audit.",
    "",
  ].join("\n");

  const summaryPath = path.join(REPORT_DIR, "SUMMARY.md");
  await fs.writeFile(summaryPath, summaryContent, "utf8");

  console.log("\nSummary:");
  console.table(
    results.map((item) => ({
      route: item.route,
      status: item.status,
      performance: item.performance,
      accessibility: item.accessibility,
      bestPractices: item.bestPractices,
      seo: item.seo,
    })),
  );

  if (failedRoutes.length > 0) {
    console.log("\nFailed routes:");
    failedRoutes.forEach((item) => {
      console.log(`- ${item.route}: ${item.error}`);
    });
  }

  console.log(`\nSaved summary: ${summaryPath}`);
}

async function main() {
  await fs.mkdir(REPORT_DIR, { recursive: true });

  const onTerminate = async () => {
    await stopPreview();
    process.exit(1);
  };

  process.on("SIGINT", onTerminate);
  process.on("SIGTERM", onTerminate);

  try {
    await buildProject();
    await startPreview();

    console.log(`\n[3/4] Running Lighthouse on ${ROUTES.length} routes...`);

    const results = [];
    for (const route of ROUTES) {
      console.log(`\n- Auditing ${route}`);
      const result = await runLighthouseForRoute(route);
      results.push(result);
      await sleep(PAGE_DELAY_MS);
    }

    console.log("\n[4/4] Writing summary...");
    await writeSummary(results);
    console.log(`\nDone. Reports folder: ${REPORT_DIR}`);
  } finally {
    await stopPreview();
  }
}

main().catch(async (error) => {
  console.error("\nLighthouse all-pages audit failed:");
  console.error(error?.stack || error);
  await stopPreview();
  process.exit(1);
});
