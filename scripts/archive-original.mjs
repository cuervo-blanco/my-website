import fs from "node:fs/promises";
import path from "node:path";
import os from "node:os";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

// The commit is fixed deliberately: rerunning this script must never replace the
// original website with a snapshot of the redesigned website.
const originalCommit = "53f787109707d6422219307a03afeb78d3489688";
const snapshotName = "2026-10-07-original-site";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const archiveDir = path.join(root, "content-archive");
const classicDir = path.join(root, "public", "classic");
const sourceArchive = path.join(archiveDir, `${snapshotName}.source.tar.gz`);
const temporaryDir = await fs.mkdtemp(path.join(os.tmpdir(), "jaime-original-site-"));

function git(args, options = {}) {
  return execFileSync("git", args, { cwd: root, maxBuffer: 16 * 1024 * 1024, ...options });
}

async function replaceInFile(relativePath, from, to) {
  const filename = path.join(temporaryDir, relativePath);
  const contents = await fs.readFile(filename, "utf8");
  if (!contents.includes(from)) throw new Error(`Original source changed: ${relativePath}`);
  await fs.writeFile(filename, contents.replace(from, to));
}

await fs.mkdir(archiveDir, { recursive: true });
const entries = git(["ls-tree", "-r", "-l", "-z", originalCommit]).toString("utf8")
  .split("\0").filter(Boolean).map((entry) => {
    const [metadata, filename] = entry.split("\t");
    const [mode, type, object, bytes] = metadata.split(/\s+/);
    return { path: filename, mode, type, gitBlob: object, bytes: Number(bytes) };
  });
const isBinaryAsset = (filename) => /^src\/assets\/(?:img|fonts)\//.test(filename)
  || /^public\//.test(filename);
const sourcePaths = entries.map((entry) => entry.path).filter((filename) => !isBinaryAsset(filename));
git(["archive", "--format=tar.gz", `--output=${sourceArchive}`, originalCommit, "--", ...sourcePaths]);
const archiveSha256 = createHash("sha256").update(await fs.readFile(sourceArchive)).digest("hex");
await fs.writeFile(`${sourceArchive}.sha256`, `${archiveSha256}  ${path.basename(sourceArchive)}\n`);
await fs.writeFile(path.join(archiveDir, `${snapshotName}.manifest.json`), JSON.stringify({
  originalCommit,
  originalTree: git(["rev-parse", `${originalCommit}^{tree}`]).toString("utf8").trim(),
  sourceArchive: path.basename(sourceArchive),
  sourceArchiveSha256: archiveSha256,
  sourceArchiveFiles: sourcePaths,
  assetPolicy: "Binary source assets and public assets are retained in the repository and recoverable from the original commit; they are not duplicated in the compact source archive.",
  files: entries,
}, null, 2) + "\n");

// Build from Git objects rather than the working tree so concurrent redesign
// edits cannot leak into the preserved website. The huge original WAV files and
// firmware are not needed to compile and remain available at their root URLs.
const buildPaths = entries.map((entry) => entry.path).filter((filename) =>
  !/^public\/(?:audio|firmware)\//.test(filename));
const buildTar = path.join(temporaryDir, "original.tar");
git(["archive", "--format=tar", `--output=${buildTar}`, originalCommit, "--", ...buildPaths]);
execFileSync("tar", ["-xf", buildTar, "-C", temporaryDir]);
await fs.unlink(buildTar);
await fs.symlink(path.join(root, "node_modules"), path.join(temporaryDir, "node_modules"), "dir");

// These adaptations exist only in the isolated build copy. The source archive
// above contains the original files without any modifications.
await replaceInFile("src/App.js", "<BrowserRouter>", '<BrowserRouter basename="/classic">');
await replaceInFile("src/entry-server.jsx", "<StaticRouter location={url}>", '<StaticRouter basename="/classic" location={`/classic${url}`}>' );
await replaceInFile("src/config/siteSections.js", 'const host = hostname.toLowerCase()',
  'if (typeof window !== "undefined" && /^\\/classic(?:\\/|$)/.test(window.location.pathname)) return null;\n  const host = hostname.toLowerCase()');
await replaceInFile("src/main.jsx", "if (container?.hasChildNodes() && !isHostedSectionSite) {",
  'const archivePath = window.location.pathname.replace(/^\\/classic/, "").replace(/\\/$/, "") || "/";\nconst hasPrerenderedArchiveRoute = ["/", "/dev", "/art", "/contact", "/terms"].includes(archivePath);\nif (container?.hasChildNodes() && !isHostedSectionSite && hasPrerenderedArchiveRoute) {');
await replaceInFile("src/components/common/PageSeo.js", 'content: robots,', 'content: "noindex,follow",');
await replaceInFile("scripts/prerender.mjs", 'route.robots || "index,follow"', '"noindex,follow"');
await replaceInFile("src/pages/Terms.js", 'href="/contact"', 'href="/classic/contact"');
await replaceInFile("src/components/sections/Reel.tsx", 'href={getSiteRoute("film", "/samples")}',
  'href={`/classic${getSiteRoute("film", "/samples")}`}');

const vite = path.join(root, "node_modules", "vite", "bin", "vite.js");
execFileSync(process.execPath, [vite, "build", "--base=/classic/"], { cwd: temporaryDir, stdio: "inherit" });
execFileSync(process.execPath, [vite, "build", "--ssr", "src/entry-server.jsx", "--outDir", "dist/server", "--base=/classic/"], { cwd: temporaryDir, stdio: "inherit" });
execFileSync(process.execPath, ["scripts/prerender.mjs"], { cwd: temporaryDir, stdio: "inherit" });

if (await fs.stat(classicDir).catch(() => null)) {
  throw new Error("public/classic already exists. Move the existing snapshot aside before rebuilding it.");
}
await fs.mkdir(classicDir, { recursive: true });
const dist = path.join(temporaryDir, "dist");
await fs.cp(path.join(dist, "assets"), path.join(classicDir, "assets"), { recursive: true });
for (const page of ["index.html", "404.html", "dev/index.html", "art/index.html", "contact/index.html", "terms/index.html"]) {
  const destination = path.join(classicDir, page);
  await fs.mkdir(path.dirname(destination), { recursive: true });
  await fs.copyFile(path.join(dist, page), destination);
}
// Vite rewrites index.html icon URLs for its configured base. Everything else
// (audio, images, video, résumé and firmware) keeps the original root asset URLs.
for (const icon of ["favicon.ico", "dragon-icon.svg", "dragon-180.png", "dragon-192.png", "dragon-512.png", "manifest.json"]) {
  await fs.copyFile(path.join(dist, icon), path.join(classicDir, icon));
}

const preservedAssetFiles = await fs.readdir(path.join(classicDir, "assets"));
console.log(`Preserved ${originalCommit}: ${sourcePaths.length} source files, ${preservedAssetFiles.length} bundled assets, five original routes.`);
console.log(`Source SHA-256: ${archiveSha256}`);
console.log(`Isolated build directory: ${temporaryDir}`);
