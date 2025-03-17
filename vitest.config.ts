import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    setupFiles: ["./src/__tests__/setup.ts"],
    coverage: {
      reporter: ["json", "cobertura"],
      include: ["src/**/*.{ts,tsx}"],
      all: true,
      reportsDirectory: "reports/coverage",
    },
    reporters: ["default", "junit"],
    outputFile: "reports/unit/junit-test-results.xml",
  },
});
