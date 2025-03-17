import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

export default defineConfig({
  build: {
    lib: {
      entry: "src/HeatLayer.ts",
      name: "LeafletHeat",
      fileName: (format) => `leaflet-heat.${format === "es" ? "mjs" : "js"}`,
    },
    rollupOptions: {
      external: ["leaflet"],
      output: {
        exports: "named",
        globals: {
          leaflet: "L",
        },
      },
    },
  },
  plugins: [dts()],
});
