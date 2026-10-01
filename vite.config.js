import { defineConfig, transformWithEsbuild } from "vite";
import react from "@vitejs/plugin-react";
import { readFileSync } from "node:fs";

const hostingConfig = JSON.parse(readFileSync(new URL("./firebase.json", import.meta.url), "utf8"));
const previewRoutes = new Map(
  hostingConfig.hosting.rewrites
    .filter((route) => route.source.startsWith("/") && route.destination?.endsWith("/index.html"))
    .map((route) => [route.source, route.destination])
);
const previewRedirects = new Map(hostingConfig.hosting.redirects.map((route) => [route.source, route.destination]));

export default defineConfig({
  plugins: [
    {
      name: "preview-prerendered-routes",
      configurePreviewServer(server) {
        // Match Firebase's canonical section rewrites in the local preview.
        server.middlewares.use((request, response, next) => {
          const [pathname, query] = (request.url || "/").split("?");
          const path = pathname.replace(/\/$/, "") || "/";
          const redirect = previewRedirects.get(path);
          if (redirect && (request.method === "GET" || request.method === "HEAD")) {
            const [destination, hash] = redirect.split("#");
            response.statusCode = 301;
            response.setHeader("Location", destination + (query ? `?${query}` : "") + (hash ? `#${hash}` : ""));
            response.end();
            return;
          }
          const destination = previewRoutes.get(path);
          if (destination && (request.method === "GET" || request.method === "HEAD")) {
            request.url = destination + (query ? `?${query}` : "");
          }
          next();
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
