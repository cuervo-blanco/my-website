import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";
import { extname } from "node:path";

const hostingConfig = JSON.parse(readFileSync(new URL("./firebase.json", import.meta.url), "utf8"));
const previewRoutes = new Map(
  hostingConfig.hosting.rewrites
    .filter((route) => route.source.startsWith("/") && !/[*{}]/.test(route.source) && route.destination?.endsWith("/index.html"))
    .map((route) => [route.source, route.destination])
);
const previewRedirects = new Map(hostingConfig.hosting.redirects.map((route) => [route.source, route.destination]));

function requestPath(request) {
  const url = new URL(request.url || "/", "http://localhost");
  return { path: url.pathname.replace(/\/+$/, "") || "/", query: url.search };
}

function isPageRequest(request) {
  return request.method === "GET" || request.method === "HEAD";
}

function isApiPath(path) {
  return path === "/api" || path.startsWith("/api/");
}

function archiveDestination(path) {
  if (path !== "/classic" && !path.startsWith("/classic/")) return null;
  const exactRoute = previewRoutes.get(path);
  if (exactRoute) return exactRoute;
  // Keep archived client redirects working while letting its compiled assets
  // pass through the normal static-file middleware.
  if (!extname(path) && !/^\/classic\/assets(?:\/|$)/.test(path)) return "/classic/index.html";
  return null;
}

function redirectPage(request, response, path, query) {
  const redirect = previewRedirects.get(path);
  if (!redirect) return false;
  const [destination, hash] = redirect.split("#");
  response.statusCode = 301;
  response.setHeader("Location", destination + query + (hash ? `#${hash}` : ""));
  response.end();
  return true;
}

export default defineConfig({
  // Known app routes are mapped explicitly below. Disabling the implicit SPA
  // fallback lets missing pages and assets receive actual 404 responses.
  appType: "mpa",
  plugins: [
    {
      name: "hosting-routes",
      configureServer(server) {
        server.middlewares.use((request, response, next) => {
          if (!isPageRequest(request)) return next();
          const { path, query } = requestPath(request);
          if (isApiPath(path)) return next();
          if (redirectPage(request, response, path, query)) return;
          const archivedHtml = archiveDestination(path);
          if (archivedHtml) {
            response.setHeader("X-Robots-Tag", "noindex,follow");
            request.url = archivedHtml + query;
          } else if (path === "/" || previewRoutes.has(path)) {
            request.url = "/index.html" + query;
          }
          next();
        });
      },
      configurePreviewServer(server) {
        // Match Firebase's canonical section rewrites in the local preview.
        server.middlewares.use((request, response, next) => {
          if (!isPageRequest(request)) return next();
          const { path, query } = requestPath(request);
          if (isApiPath(path)) return next();
          if (redirectPage(request, response, path, query)) return;
          const archivedHtml = archiveDestination(path);
          const destination = archivedHtml || (path === "/" ? "/index.html" : previewRoutes.get(path));
          if (archivedHtml) response.setHeader("X-Robots-Tag", "noindex,follow");
          if (destination) request.url = destination + query;
          next();
        });

        // This runs after Vite's static-file middleware has had a chance to
        // serve every existing file, including assets and direct HTML URLs.
        return () => server.middlewares.use((request, response, next) => {
          if (!isPageRequest(request) || isApiPath(requestPath(request).path)) return next();
          try {
            const html = readFileSync(new URL("./dist/404.html", import.meta.url), "utf8");
            response.statusCode = 404;
            response.setHeader("Content-Type", "text/html; charset=utf-8");
            response.setHeader("X-Robots-Tag", "noindex,follow");
            response.end(request.method === "HEAD" ? undefined : html);
          } catch {
            next();
          }
        });
      },
    },
    {
      name: "treat-js-as-jsx",
      enforce: "pre",
      async transform(code, id) {
        if (!/src\/.*\.js$/.test(id)) {
          return null;
        }

        return transformWithEsbuild(code, id, {
          loader: "jsx",
          jsx: "automatic",
        });
      },
    },
    react(),
  ],
  optimizeDeps: {
    esbuildOptions: {
      loader: {
        ".js": "jsx",
      },
    },
  },
  server: {
    host: "127.0.0.1",
    port: 5173,
  },
  preview: {
    host: "127.0.0.1",
    port: 4173,
  },
  test: {
    include: ["src/**/*.{test,spec}.{js,jsx,ts,tsx}"],
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/setupTests.js"],
    css: true,
    environmentOptions: {
      jsdom: {
        url: "http://localhost/",
      },
    },
  },
});
