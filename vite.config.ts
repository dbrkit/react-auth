import { resolve } from "node:path";

import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";

import tsConfigPaths from "vite-tsconfig-paths";

// https://vitejs.dev/config/
export default defineConfig(() => ({
  plugins: [
    react(),
    tsConfigPaths(),
    dts({
      // include: ["./src"],
      insertTypesEntry: true,
    }),
  ],
  build: {
    sourcemap: true,
    lib: {
      entry: resolve("./src", "index.ts"),
      name: "ReactRouter",
      formats: ["cjs", "es", "umd"],
      fileName: (format) => `index.${format}.js`,
    },
    rollupOptions: {
      external: ["react", "@dbrkit/react-router"],
      globals: {
        react: {
          name: "React",
        },
        "@dbrkit/react-router": {
          name: "ReactRouter",
        },
      },
    },
  },
}));
