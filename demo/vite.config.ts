import { defineConfig } from "vite";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  base: "./",
  build: {
    target: "esnext",
    outDir: "../dist/demo",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        draw: resolve(__dirname, "draw.html"),
      },
    },
  },
  resolve: {
    alias: {
      "@src": resolve(__dirname, "../src"),
    },
  },
});
