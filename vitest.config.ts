import path from "node:path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vitest/config"

export default defineConfig({
  plugins: [react()],
  test: {
    isolate: true,
    environment: "jsdom",
    setupFiles: ["./vitest.setup.ts"],

    minWorkers: 2,

    pool: "forks",
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./"),
    },
  },
})
