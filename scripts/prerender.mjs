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
  return pattern.test(html)
    ? html.replace(pattern, replacement)
    : injectTagBeforeHeadClose(html, `    ${replacement}`);
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
  const absoluteUrl = new URL(route.path, route.siteUrl).toString();
  const imageUrl = new URL(route.image, route.siteUrl).toString();
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
    `<meta name="robots" content="${escapeHtml(route.robots || "index,follow,max-image-preview:large")}" />`
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

  for (const [attribute, name, content] of [
    ["name", "theme-color", route.themeColor],
    ["property", "og:site_name", route.siteName],
    ["property", "og:image:alt", route.imageAlt],
    ["name", "twitter:image:alt", route.imageAlt],
  ]) {
    nextHtml = upsertTag(
      nextHtml,
      new RegExp(`<meta\\s+${attribute}="${name}"\\s+content="[^"]*"\\s*\\/?>`, "i"),
      `<meta ${attribute}="${name}" content="${escapeHtml(content)}" />`
    );
  }

  nextHtml = removeTag(
    nextHtml,
    /\s*<script\s+type="application\/ld\+json"\s+data-prerender="structured-data">[\s\S]*?<\/script>/i
  );

  if (route.structuredData) {
    nextHtml = injectTagBeforeHeadClose(
      nextHtml,
      `    <script type="application/ld+json" data-prerender="structured-data">${JSON.stringify(
        route.structuredData
      ).replaceAll("<", "\\u003c")}</script>`
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

for (const route of prerenderRoutes) {
  const html = buildDocument(route);
  const outputPath = getOutputPath(route.path);
  await fs.mkdir(path.dirname(outputPath), { recursive: true });
  await fs.writeFile(outputPath, html, "utf8");

}

// Derive the sitemap from the same routes we render, so it stays in sync without
// suggesting that legal pages or the preserved classic site should be indexed.
const indexableRoutes = prerenderRoutes.filter((route) => !/\bnoindex\b/i.test(route.robots || ""));
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${indexableRoutes.map((route) => `  <url><loc>${escapeHtml(new URL(route.path, route.siteUrl).toString())}</loc></url>`).join("\n")}
</urlset>
`;
await fs.writeFile(path.join(distDir, "sitemap.xml"), sitemap, "utf8");

// Hosting serves this document with a real 404 response for unknown paths.
const notFoundHtml = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex,follow" />
    <meta name="theme-color" content="#000000" />
    <title>Page not found | Jaime Osvaldo</title>
    <link rel="icon" type="image/svg+xml" href="/dragon-icon.svg" />
    <style>
      * { box-sizing: border-box; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center; background: #000; color: #fff; font-family: system-ui, sans-serif; padding: 32px; }
      main { max-width: 600px; }
      .code { font-family: monospace; color: #b4d3c1; letter-spacing: .12em; }
      h1 { font-size: clamp(3rem, 10vw, 5rem); line-height: .95; letter-spacing: -.05em; margin: 28px 0; }
      p { line-height: 1.6; color: #c5cbc9; }
      nav { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
      a { display: inline-block; color: #000; background: #b4d3c1; padding: 14px 20px; text-decoration: none; border-radius: 6px; font-weight: 650; }
      a + a { background: transparent; color: #fff; border: 1px solid #424752; }
      a:hover { filter: brightness(1.15); }
      a:focus-visible { outline: 3px solid #fff; outline-offset: 5px; }
    </style>
  </head>
  <body>
    <main>
      <p class="code">JAIME OSVALDO / 404</p>
      <h1>Page not found</h1>
      <p>This page is missing or its address has changed. Find sound work, audio software, and animation on the homepage.</p>
      <nav aria-label="Find your way back">
        <a href="/">Back to home</a>
        <a href="/contact">Contact Jaime</a>
      </nav>
    </main>
  </body>
</html>
`;
await fs.writeFile(path.join(distDir, "404.html"), notFoundHtml, "utf8");

await fs.rm(path.join(distDir, "server"), { recursive: true, force: true });
