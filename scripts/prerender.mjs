import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const currentFilePath = fileURLToPath(import.meta.url);
const rootDir = path.resolve(path.dirname(currentFilePath), "..");
const distDir = path.join(rootDir, "dist");
const templatePath = path.join(distDir, "index.html");
const serverEntryPath = path.join(distDir, "server", "entry-server.js");

const { prerenderRoutes, render } = await import(pathToFileURL(serverEntryPath).href);
const template = await fs.readFile(templatePath, "utf8");

function upsertTag(html, pattern, replacement) {
  return pattern.test(html) ? html.replace(pattern, replacement) : html;
}

function injectTagBeforeHeadClose(html, markup) {
  return html.replace("</head>", `${markup}\n  </head>`);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function removeTag(html, pattern) {
  return html.replace(pattern, "");
}

function buildHead(html, route) {
  const absoluteUrl = new URL(route.path, "https://jaimeosvaldo.com").toString();
  const imageUrl = new URL("/og-image.png", "https://jaimeosvaldo.com").toString();
  const keywords = Array.isArray(route.keywords)
    ? route.keywords.join(", ")
    : route.keywords;

  let nextHtml = html;

  nextHtml = upsertTag(
    nextHtml,
    /<title>[\s\S]*?<\/title>/i,
    `<title>${escapeHtml(route.title)}</title>`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="description" content="${escapeHtml(route.description)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="robots"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="robots" content="${escapeHtml(route.robots || "index,follow")}" />`
  );

  if (keywords) {
    const keywordsTag = `<meta name="keywords" content="${escapeHtml(keywords)}" />`;
    nextHtml = /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i.test(nextHtml)
      ? nextHtml.replace(
          /<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i,
          keywordsTag
        )
      : injectTagBeforeHeadClose(nextHtml, `    ${keywordsTag}`);
  } else {
    nextHtml = removeTag(
      nextHtml,
      /\s*<meta\s+name="keywords"\s+content="[^"]*"\s*\/?>/i
    );
  }

  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:type"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:type" content="${escapeHtml(route.type || "website")}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:title" content="${escapeHtml(route.title)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:description" content="${escapeHtml(route.description)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:url"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:url" content="${escapeHtml(absoluteUrl)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+property="og:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta property="og:image" content="${escapeHtml(imageUrl)}" />`
  );

  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="twitter:title"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:title" content="${escapeHtml(route.title)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="twitter:description"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:description" content="${escapeHtml(route.description)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<meta\s+name="twitter:image"\s+content="[^"]*"\s*\/?>/i,
    `<meta name="twitter:image" content="${escapeHtml(imageUrl)}" />`
  );
  nextHtml = upsertTag(
    nextHtml,
    /<link\s+rel="canonical"\s+href="[^"]*"\s*\/?>/i,
    `<link rel="canonical" href="${escapeHtml(absoluteUrl)}" />`
  );

  nextHtml = removeTag(
    nextHtml,
    /\s*<script\s+type="application\/ld\+json"\s+data-prerender="structured-data">[\s\S]*?<\/script>/i
  );

  if (route.structuredData) {
    nextHtml = injectTagBeforeHeadClose(
      nextHtml,
      `    <script type="application/ld+json" data-prerender="structured-data">${JSON.stringify(
        route.structuredData
      )}</script>`
    );
  }

  return nextHtml;
}

function buildDocument(route) {
  const appHtml = render(route.path);
  const htmlWithApp = template.replace(
    /<div id="root"><\/div>/i,
    `<div id="root">${appHtml}</div>`
  );

  return buildHead(htmlWithApp, route);
}

function getOutputPath(routePath) {
  if (routePath === "/") {
    return path.join(distDir, "index.html");
  }

  const normalizedPath = routePath.replace(/^\//, "").replace(/\/$/, "");
  return path.join(distDir, normalizedPath, "index.html");
}

let rootHtml = "";

for (const route of prerenderRoutes) {
  const html = buildDocument(route);
  const outputPath = getOutputPath(route.path);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");

  if (route.path === "/") {
    rootHtml = html;
  }
}

if (rootHtml) {
  await fs.writeFile(path.join(distDir, "404.html"), rootHtml, "utf8");
}

await fs.rm(path.join(distDir, "server"), { recursive: true, force: true });
